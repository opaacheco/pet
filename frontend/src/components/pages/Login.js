import React from "react";

import styles from "../form/form.module.css";

import Input from "../form/input";

import { Link } from "react-router-dom";

import { useState, useContext } from "react";

import { Context } from "../../context/UserContext";

function Login() {
  const [user, setUser] = useState({});
  const { login } = useContext(Context);
  function handleSubmit(e) {
    e.preventDefault();
    login(user);
  }
  function handleChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
    console.log(user);
  }
  return (
    <section className={styles.form_container}>
      <h1>Entrar</h1>
      <form onSubmit={handleSubmit}>
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
        <input type="submit" value="Entrar" />
      </form>
      <p>
        não tem conta? <Link to={"/register"}>clique aqui</Link>
      </p>
    </section>
  );
}

export default Login;
