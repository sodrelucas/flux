import { auth } from "../../services/firebaseConnection";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

import style from "./register.module.css";
import { toast } from "react-toastify";

import { Input } from "../input";
import { useState } from "react";

interface RegisterProps {
  onHandleForm: () => void;
}

export default function Register({ onHandleForm }: RegisterProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");

  async function handleRegister() {
    if (!email || !password || !userName) {
      toast.error("Preencha todos os campos corretamente");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(userCredential.user, { displayName: userName });
      toast.success("Conta criada com sucesso!");
      onHandleForm();
    } catch (error: any) {
    if (error.code === "auth/email-already-in-use") {
      toast.error("Este e-mail já está cadastrado");
    } else if (error.code === "auth/weak-password") {
      toast.error("A senha deve ter no mínimo 6 caracteres");
    } else if (error.code === "auth/invalid-email") {
      toast.error("E-mail inválido");
    } else {
      toast.error("Erro ao criar conta. Tente novamente.");
    }
  }

  return (
    <div className={style.formContainer}>
      <h2>Bem-vindo(a) ao Flux</h2>
      <h4>Crie sua conta e comece a gerenciar seu dinheiro.</h4>
      <Input
        type="text"
        placeholder="Seu Nome"
        label="Nome"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
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
      <button className={style.buttonRegister} onClick={handleRegister}>
        Criar Conta
      </button>
      <p className={style.newUser}>
        Já possui uma conta? <span onClick={onHandleForm}>Faça login</span> e
        controle o fluxo do seu dinheiro.
      </p>
    </div>
  );
}
