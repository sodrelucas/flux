import logo from "../../assets/logo.png";
import style from "./welcome.module.css";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import Login from "../../components/login";
import Register from "../../components/register";
import { useState } from "react";

export default function Welcome() {
  const [user, setUser] = useState(true);
  const [mobile, setMobile] = useState(false);

  function haveAccount() {
    setUser(!user);
  }

  function handleMobile() {
    setMobile(!mobile);
  }

  return (
    <div className={`${style.loginContainer}`}>
      <ToastContainer autoClose={2000} position="top-right" theme="colored" />

      <img
        src={logo}
        alt="logo flux"
        className={style.logo}
        onClick={handleMobile}
      />
      <div className={`${style.textContainer} ${mobile ? style.hideText : ""}`}>
        <h1>
          <span>Controle o Fluxo</span> do Seu Dinheiro.
        </h1>
        <p>
          Flux é a ferramenta definitiva para gerenciar seu orçamento,
          acompanhar despesas e investir com confiança. Tenha total clareza
          sobre suas finanças.
        </p>

        <button className={style.createAccount} onClick={handleMobile}>
          Começar a Organizar (É Grátis)
        </button>
      </div>

      <div className={style.test}>
        {!user ? (
          <Register onHandleForm={haveAccount} />
        ) : (
          <Login onHandleForm={haveAccount} />
        )}
      </div>

      <div className={style.test2}>
        {mobile ? (
          !user ? (
            <Register onHandleForm={haveAccount} />
          ) : (
            <Login onHandleForm={haveAccount} />
          )
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
