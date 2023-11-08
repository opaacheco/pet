import api from "../../../utils/api";

import Styles from "./AddPet.module.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import UseFlashMessage from "../../../hooks/UseFlashMessage";
import Petform from "../../form/Petform";

function AddPet() {
  const token = localStorage.getItem("token" || "");
  const { setFlashMessage } = UseFlashMessage();
  const history = useNavigate();
  async function registerPet(pet) {
    let msgType = "sucess";
    let msgText = "cadastrado com sucesso";
    const formData = new FormData();
    await Object.keys(pet).forEach((key) => {
      if (key === "images") {
        for (let index = 0; index < pet[key].length; index++) {
          formData.append("images", pet[key][index]);
        }
      } else {
        formData.append(key, pet[key]);
      }
    });
    const data = await api
      .post("pets/create", formData, {
        Authorization: `Bearer ${JSON.parse(token)}`,
        "Content-type": "multipart/form-data",
      })
      .then((response) => {
        console.log(response.data);
        return response.data;
      })
      .catch((error) => {
        console.log(error);
        msgType = "error";
        return error.response.data.message;
      });
    setFlashMessage(data.message, msgType);
    if (msgType !== "error") {
      history("/pets/mypets");
    }
  }
  return (
    <section className={Styles.addpet_header}>
      <div>
        <h1>Cadraste o seu pet</h1>
        <p>depois ele ficará disponivel para adoção</p>
      </div>
      <Petform handleSubmit={registerPet} btnText="cadastrar" />
    </section>
  );
}

export default AddPet;
