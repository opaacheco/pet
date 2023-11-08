import api from "../../../utils/api";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Styles from "./dashboard.module.css";

import UseFlashMessage from "../../../hooks/UseFlashMessage";

import Roundedimage from "../../layouts/Roundedimage";

function MyPets() {
  const [pets, setPets] = useState([]);
  const token = localStorage.getItem("token" || "");
  const { setFlashMessage } = UseFlashMessage();
  useEffect(() => {
    api
      .get("/pets/mypets", {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      })
      .then(
        (response) => {
          setPets(response.data.pets);
        },
        [token]
      );
  });

  async function removePt(id) {
    let msgType = "sucess";
    const data = await api
      .delete(`/pets/${id}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      })
      .then((response) => {
        const updatePets = pets.filter((pet) => pet._id != id);
        setPets(updatePets);
        return response.data;
      })
      .catch((err) => {
        msgType = "error";
        return err.response.message;
      });
    setFlashMessage(data.message, msgType);
  }
  return (
    <section>
      <div className={Styles.petlist_header}>
        <h1>MyPets</h1>
        <Link to="/pet/add">Cadastrar Pet</Link>
      </div>
      <div className={Styles.petlist_container}>
        {pets.length > 0 &&
          pets.map((pet) => (
            <div className={Styles.petlist_row} key={pet._id}>
              <Roundedimage
                alt={pet.name}
                src={`${process.env.REACT_APP_API}/images/pets/${pet.images[0]}`}
                width="px75"
              />
              <span className="bold">{pet.name}</span>
              <div className={Styles.actions}>
                {pet.available ? (
                  <>
                    {pet.adopter && (
                      <button className={Styles.petlist_conclude}>
                        Concluir adoção
                      </button>
                    )}
                    <Link to={`/pet/edit/${pet._id}`}>editar</Link>
                    <button
                      onClick={() => {
                        removePt(pet._id);
                      }}
                    >
                      excluir
                    </button>
                  </>
                ) : (
                  <>
                    <p>adotado</p>
                  </>
                )}
              </div>
            </div>
          ))}
        {pets.length === 0 && <p>não há pets cadastrados</p>}
      </div>
    </section>
  );
}

export default MyPets;
