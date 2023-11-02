const getToken = require("../helpers/get-token");
const getUserByToken = require("../helpers/get-user-by-token");
const Pet = require("../models/Pet");

const ObjectId = require("mongoose").Types.ObjectId;

module.exports = class PetController {
  static async create(req, res) {
    const avalible = true;

    const { name, age, weight, color } = req.body;

    const images = req.files;

    //validations
    if (!name) {
      res.status(422).json({ message: "o nome é obrigatório!" });
      return;
    }
    if (!age) {
      res.status(422).json({ message: "a idade é obrigatória!" });
      return;
    }
    if (!weight) {
      res.status(422).json({ message: "o peso é obrigatório!" });
      return;
    }
    if (!color) {
      res.status(422).json({ message: "a cor é obrigatória!" });
      return;
    }

    if (images.length === 0) {
      res.status(422).json({ message: "a imagem é obrigatória!" });
    }
    const token = getToken(req);
    const user = await getUserByToken(token, res);

    const pet = new Pet({
      name,
      age,
      weight,
      color,
      avalible,
      images: [],
      user: {
        _id: user._id,
        name: user.name,
        image: user.image,
        phone: user.phone,
      },
    });

    images.map((image) => {
      pet.images.push(image.filename);
    });

    try {
      const petcreate = await pet.save();
      res
        .status(201)
        .json({ message: "caraca não é que deu certo?", petcreate });
    } catch (error) {
      res.status(500).json({ message: error });
    }

    res.json({ message: "deu certo pedroca" });
  }

  static async petsAll(req, res) {
    const pets = await Pet.find().sort("-createdAt");
    res.status(200).json({ pets: pets });
  }

  static async getUserPets(req, res) {
    const token = getToken(req);
    const user = await getUserByToken(token, res);

    const pets = await Pet.find({ "user._id": user._id }).sort("-createdAt");

    res.status(200).json({ pets: pets });
  }

  static async getAllUserAdoptions(req, res) {
    const token = getToken(req);
    const user = await getUserByToken(token, res);

    const pets = await Pet.find({ "adopter._id": user._id }).sort("-createdAt");

    res.status(200).json({ pets: pets });
  }

  static async getPetById(req, res) {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      res.status(422).json({ message: "ID é inválido" });
    }

    const pet = await Pet.findById({ _id: id });

    if (!pet) {
      res.status(422).json({ message: "pet não encontrado" });
    }

    res.status(200).json({ pet: pet });
  }

  static async deleteById(req, res) {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      res.status(422).json({ message: "ID é inválido" });
      return;
    }

    const pet = await Pet.findById({ _id: id });

    if (!pet) {
      res.status(422).json({ message: "pet não encontrado" });
      return;
    }

    //check se o pet é do usuario logado
    const token = getToken(req);
    const user = await getUserByToken(token, res);

    if (pet.user._id.toString() != user._id.toString()) {
      console.log(pet.user._id);
      console.log(user._id);
      res
        .status(422)
        .json({ message: "houve um  erro tente novamente mais tarde" });
      return;
    }

    await Pet.findByIdAndDelete(id);
    res.status(200).json({ message: "pet removido com sucessoo!" });
  }

  static async updatePet(req, res) {
    const id = req.params.id;
    const { name, age, weight, color, avalible } = req.body;
    const images = req.files;

    const updateData = {};

    const pet = await Pet.findById({ _id: id });
    if (!pet) {
      return res.status(422).json({ message: "o pet não está cadastrado" });
    }
    //check se o pet é do usuario logado
    const token = getToken(req);
    const user = await getUserByToken(token, res);

    if (pet.user._id.toString() !== user._id.toString()) {
      res.status(422).json({
        message:
          "não foi possivel completar sua ação, tente novamente mais tarde",
      });
    }

    //validações
    if (!name) {
      return res.status(422).json({ message: "o nome é obrigatório" });
    } else {
      updateData.name = name;
    }
    if (!age) {
      return res.status(422).json({ message: "a idade é obrigatória" });
    } else {
      updateData.age = age;
    }
    if (!weight) {
      return res.status(422).json({ message: "o peso é obrigatório" });
    } else {
      updateData.weight = weight;
    }
    if (!color) {
      return res.status(422).json({ message: "a cor é obrigatória" });
    } else {
      updateData.name = name;
    }
    console.log(images);
    if (images.length === 0) {
      return res.status(422).json({ message: "a imagem é obrigatória" });
    } else {
      updateData.images = [];
      images.map((image) => {
        updateData.images.push(image.filename);
      });
    }

    await Pet.findByIdAndUpdate(id, updateData);

    res.status(200).json({ message: "pet atualizado com sucesso!" });
  }

  static async schedule(req, res) {
    const id = req.params.id;
    // check if exists
    const pet = await Pet.findById({ _id: id });
    if (!pet) {
      return res.status(422).json({ message: "pet não existe" });
    }
    // check se o pet é meu
    const token = getToken(req);
    const user = await getUserByToken(token, res);
    if (pet.user._id.equals(user._id)) {
      return res.status(422).json({ message: "esse dog é teu bro" });
    }

    //verificando se ja fez uma marcação de visita
    if (pet.adopter) {
      if (pet.adopter._id.equals(user._id)) {
        res
          .status(422)
          .json({ message: "você ja agendou uma visita para esse pet" });
      }
      return;
    }

    //adicionando um adotador
    pet.adopter = {
      _id: user._id,
      name: user.name,
      phone: user.phone,
      image: user.image,
    };

    await Pet.findByIdAndUpdate(id, pet);

    res.status(200).json({
      message: `agendado mano, entre em contato com ${pet.user.name} através do contato ${pet.user.phone}`,
    });
  }

  static async concludeAdoption(req, res) {
    const id = req.params.id;
    const pet = await Pet.findById({ _id: id });
    if (!pet) {
      return res.status(422).json({ message: "pet não encontrado" });
    }

    const token = getToken(req);
    const user = await getUserByToken(token, res);
    if (pet.user._id.toString() !== user._id.toString()) {
      return res.status(422).json({ message: "esse dog é teu bro" });
    }

    pet.available = false;

    await Pet.findByIdAndUpdate(id, pet);

    res
      .status(200)
      .json({ message: "o ciclo de adoção concluido com sucesso, parabéns!" });
  }
};
