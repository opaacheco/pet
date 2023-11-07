import api from "../../../utils/api";

import { useState, useEffect } from "react";

import formStyles from "./Profile.module.css";
import styles from "../../form/form.module.css";

import UseFlashMessage from "../../../hooks/UseFlashMessage";

import Input from "../../form/input";
import Roundedimage from "../../layouts/Roundedimage";

function Profile() {
  const { setFlashMessage } = UseFlashMessage();
  const [preview, setPreview] = useState();
  const [user, setUser] = useState({});
  const [token] = useState(localStorage.getItem("token" || ""));
  console.log(token);
  useEffect(() => {
    api
      .get("/users/checkuser", {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      })
      .then((response) => {
        setUser(response.data);
      });
  }, [token]);

  function handleChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }
  function onFileChange(e) {
    setPreview(e.target.files[0]);
    setUser({ ...user, [e.target.name]: e.target.files[0] });
  }
  async function handleSubmit(e) {
    e.preventDefault();

    let msgType = "sucess";

    const formData = new FormData();

    await Object.keys(user).forEach((key) => formData.append(key, user[key]));

    const data = await api
      .patch(`/users/edit/${user._id}`, formData, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
          "Content-Type": "mutipart/form-data",
        },
      })
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        msgType = "error";
        return err.response.data;
      });
    setFlashMessage(data.message, msgType);
  }
  return (
    <section>
      <div className={formStyles.profile_header}>
        <h1>Profile</h1>
        {(user.image || preview) && (
          <Roundedimage
            alt={user.name}
            src={
              preview
                ? URL.createObjectURL(preview)
                : `${process.env.REACT_APP_API}/images/users/${user.image}`
            }
          />
        )}
      </div>
      <form onSubmit={handleSubmit} className={styles.form_container}>
        <Input
          text="Imagem"
          type="file"
          name="image"
          handleOnChange={onFileChange}
        />
        <Input
          text="E-mail"
          type="email"
          name="email"
          placeholder="digite seu e-mail"
          handleOnChange={handleChange}
          value={user.email || ""}
        />
        <Input
          text="Nome"
          type="text"
          name="name"
          placeholder="digite seu nome"
          handleOnChange={handleChange}
          value={user.name || ""}
        />
        <Input
          text="Senha"
          type="password"
          name="password"
          placeholder="digite sua nove senha"
          handleOnChange={handleChange}
        />
        <Input
          text="Confirma Senha"
          type="password"
          name="confirmPassword"
          placeholder="digite sua nove senha"
          handleOnChange={handleChange}
        />
        <input type="submit" value="Editar" />
      </form>
    </section>
  );
}

export default Profile;
