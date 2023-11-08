import api from "../../../utils/api";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import styles from "./AddPet.module.css";

import Petform from "../../form/Petform";

import UseFlashMessage from "../../../hooks/UseFlashMessage";

function EditePet() {
  const [pet, setPet] = useState({});
  const [token] = useState(localStorage.getItem("token") || "");
  const { id } = useParams();
  const { setFlashMessage } = UseFlashMessage();

  useEffect(() => {
    api
      .get(`/pets/${id}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      })
      .then((response) => {
        setPet(response.data.pet);
      })
      .catch();
  }, [token, id]);
  console.log(pet.name);
  async function updatePet() {}
  return (
    <section>
      <div className={styles.addpet_header}>
        <h1>Editando o Pet: {pet.name}</h1>
        <p>Depois da edição os dados serão atualizados no sistema</p>
      </div>
      {pet.name && (
        <Petform handleSubmit={updatePet} petData={pet} btnText="Atualizar" />
      )}
    </section>
  );
}

export default EditePet;
