import { useState } from "react";
import formStyles from "./form.module.css";

import Input from "./input";
import Select from "./Select";

function Petform({ handleSubmit, petData, btnText }) {
  const [pet, setPet] = useState(petData || {});
  const [preview, setPreview] = useState([]);
  const colors = ["Branco", "Preto", "Cinza", "Caramelo", "Mesclado"];
  function onFileChange(e) {
    setPreview(Array.from(e.target.files));
    setPet({ ...pet, images: [...e.target.files] });
  }
  function handleChange(e) {
    setPet({ ...pet, [e.target.name]: e.target.value });
  }
  function handleColor(e) {
    setPet({ ...pet, color: e.target.options[e.target.selectedIndex].text });
  }
  function submit(e) {
    e.preventDefault();
    console.log(pet);
    handleSubmit(pet);
  }
  return (
    <form onSubmit={submit} className={formStyles.form_container}>
      <div className={formStyles.preview_pet_image}>
        {preview.length > 0
          ? preview.map((image, index) => (
              <img
                src={URL.createObjectURL(image)}
                alt={pet.name}
                key={`${pet.name} + ${index}`}
              />
            ))
          : pet.images &&
            pet.images.map((image, index) => (
              <img
                src={`${process.env.REACT_APP_API}/images/pet/${image}`}
                alt={pet.name}
                key={`${pet.name} + ${index}`}
              />
            ))}
      </div>
      <Input
        text="imagens do pet"
        type="file"
        name="images"
        handleOnChange={onFileChange}
        multiple={true}
      />
      <Input
        text="nome do pet"
        type="text"
        name="name"
        placeholder="digite o nome do pet"
        handleOnChange={handleChange}
        value={pet.name || ""}
      />
      <Input
        text="idade do pet"
        type="text"
        name="age"
        placeholder="digite a idade do pet"
        handleOnChange={handleChange}
        value={pet.age || ""}
      />
      <Input
        text="peso do pet"
        type="number"
        name="weight"
        placeholder="digite o peso do pet"
        handleOnChange={handleChange}
        value={pet.weight || ""}
      />
      <Select
        name="color"
        text="selecione a cor"
        options={colors}
        handleOnChange={handleColor}
        value={pet.color || ""}
      />
      <input type="submit" value={btnText} />
    </form>
  );
}

export default Petform;
