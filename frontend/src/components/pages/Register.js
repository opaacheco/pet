import { useContext, useState } from "react";

import Input from "../form/input";

import styles from "../form/form.module.css";

import { Link } from "react-router-dom";

import { Context } from "../../context/UserContext";

function Register() {
  const [user, setUser] = useState({});
  const { register } = useContext(Context);
  function handleChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }
  function handleSubmit(e) {
    e.preventDefault();
    register(user);
  }
  return (
    <section className={styles.form_container}>
      <h1>Registrar</h1>
      <form onSubmit={handleSubmit}>
        <Input
          text="Name"
          type="text"
          name="name"
          placeholder="digite seu nome"
          handleOnChange={handleChange}
        />
        <Input
          text="Telefone"
          type="text"
          name="phone"
          placeholder="digite o seu telefone"
          handleOnChange={handleChange}
        />
        <Input
          text="E-mail"
          type="email"
          name="email"
          placeholder="digite o seu e-mail"
          handleOnChange={handleChange}
        />
        <Input
          text="Senha"
          type="password"
          name="password"
          placeholder="digite a sua senha"
          handleOnChange={handleChange}
        />
        <Input
          text="Confirmação de senha"
          type="password"
          name="confirmpassword"
          placeholder="confirme a sua senha"
          handleOnChange={handleChange}
        />
        <input type="submit" value="cadastrar" />
      </form>
      <p>
        já tem conta? <Link to={"/login"}>clique aqui</Link>
      </p>
    </section>
  );
}

export default Register;
