const createusertoken = require("../helpers/create-user-token");
const getToken = require("../helpers/get-token");
const getUserByToken = require("../helpers/get-user-by-token");
const User = require("../models/User");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports = class UserController {
  static async register(req, res) {
    const { name, email, password, phone, confirmpassword } = req.body;

    //validações
    if (!name) {
      res.status(422).json({ message: "o nome do usuário é obrigatório" });
      return;
    }
    if (!email) {
      res.status(422).json({ message: "o e-mail do usuário é obrigatório" });
      return;
    }
    if (!phone) {
      res.status(422).json({ message: "o telefone do usuário é obrigatório" });
      return;
    }
    if (!password) {
      res.status(422).json({ message: "a senha do usuário é obrigatório" });
      return;
    }
    if (!confirmpassword) {
      res
        .status(422)
        .json({ message: "a confirmação de senha do usuário é obrigatório" });
      return;
    }
    if (password != confirmpassword) {
      res.status(422).json({ message: "as senhas não são iguais" });
      return;
    }

    //verificando se o usuário já existe
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      res.status(422).json({ message: "esse e-mail já está cadastrado" });
      return;
    }

    //criar a senha
    const salt = await bcrypt.genSaltSync(12);
    const hashedpassword = bcrypt.hashSync(password, salt);

    //criar o objeto utilizador
    const user = new User({
      name: name,
      email: email,
      phone: phone,
      password: hashedpassword,
    });

    //debug
    try {
      const newUser = await user.save();
      await createusertoken(newUser, req, res);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;

    if (!email) {
      res.status(422).json({ message: "o e-mail é obrigatório" });
      return;
    }

    if (!password) {
      res.status(422).json({ message: "a senha é obrigatória" });
      return;
    }

    const userExist = await User.findOne({ email: email });

    //validando a existência do user e a senha
    if (!userExist) {
      res.status(422).json({ message: "o e-mail não está cadastrado" });
      return;
    }

    const passwortMatch = bcrypt.compareSync(password, userExist.password);

    if (!passwortMatch) {
      res.status(422).json({ message: "a senha não está correta" });
      return;
    }

    await createusertoken(userExist, req, res);

    res.json({ message: "logado" });
  }

  static async checkUser(req, res) {
    let currentUser;

    console.log(req.headers.authorization);

    if (req.headers.authorization) {
      const token = getToken(req);
      const decoded = jwt.verify(token, "nossosecret");

      currentUser = await User.findById(decoded.id);

      currentUser.password = undefined;
    } else {
      currentUser = null;
    }

    res.status(200).send(currentUser);
  }

  static async getUser(req, res) {
    const id = req.params.id;

    const user = await User.findById({ _id: id }).select("-password");

    if (!user) {
      res.status(422).json({ message: "o usuário não existe" });
      return;
    }

    res.status(200).json({ message: "encontrado", user: user });
  }

  static async editUser(req, res) {
    const tokenzin = getToken(req);
    const user = await getUserByToken(tokenzin, res);

    const { name, email, phone, password, confirmpassword } = req.body;

    let image = " ";

    if (req.file) {
      user.image = req.file.filename;
    }

    // //validações
    if (!name) {
      res.status(422).json({ message: "o nome do usuário é obrigatório" });
      return;
    }

    user.name = name;

    if (!email) {
      res.status(422).json({ message: "o e-mail do usuário é obrigatório" });
      return;
    }

    //check user exists
    const userExists = await User.findOne({ email: email });

    if (user.email !== email && userExists) {
      res.status(422).json({ message: "Por favor, utilize outro e-mail!" });
      return;
    }

    user.email = email;

    if (!phone) {
      res.status(422).json({ message: "o telefone do usuário é obrigatório" });
      return;
    }

    user.phone = phone;

    if (password != confirmpassword) {
      res.status(422).json({ message: "as senhas não são iguais" });
      return;
    } else if (password == confirmpassword && password != null) {
      const salt = await bcrypt.genSalt(12);
      const reqPassword = req.body.password;

      const passwordHash = await bcrypt.hash(reqPassword, salt);
      user.password = passwordHash;
    }

    // console.log(passwordHash);
    console.log(user);
    try {
      // returns updated data
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $set: user },
        { new: true }
      );
      res.json({
        message: "Usuário atualizado com sucesso!",
        data: updatedUser,
      });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
};
