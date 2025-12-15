import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebaseConnection";

import style from "./login.module.css";
import { toast } from "react-toastify";

import { Input } from "../input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface LoginProps {
  onHandleForm: () => void;
}

export default function Login({ onHandleForm }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  async function handleLogin() {
    if (!email || !password) {
      toast.error("Preencha os campos corretamente");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.loading("Login realizado com sucesso!");
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 1000);
    } catch (error:any) {
      if (error.code === "auth/invalid-credential") {
        toast.error("E-mail ou senha incorretos");
      } else if (error.code === "auth/user-not-found") {
        toast.error("Usuário não encontrado");
      } else if (error.code === "auth/invalid-email") {
        toast.error("E-mail inválido");
      } else {
        toast.error("Erro ao realizar login. Tente novamente.");
      }
    }
  }

  return (
    <div className={`${style.formContainer} `}>
      <h2>Bem-vindo(a) ao Flux</h2>
      <h4>Acesse sua conta para começar a gerenciar.</h4>
      <Input
        type="email"
        placeholder="seu.email@exemplo.com"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        placeholder="****"
        label="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Entrar</button>
      <p className={style.newUser}>
        Novo no Flux?{" "}
        <span
          onClick={() => {
            onHandleForm();
          }}
        >
          Crie sua conta.
        </span>
      </p>
    </div>
  );
}
