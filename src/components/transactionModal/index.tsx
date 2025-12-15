import { useState } from "react";
import style from "./transactionModal.module.css";
import { MdClose } from "react-icons/md";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { OrbitProgress } from "react-loading-indicators";
import "react-toastify/dist/ReactToastify.css";

import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "../../services/firebaseConnection";

interface TransactionModalProps {
  setOpenModal: (value: boolean) => void;
}

export function TransactionModal({ setOpenModal }: TransactionModalProps) {
  const [isIncome, setIsIncome] = useState(true);
  const [value, setValue] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    if (!value || description || !category) {
      toast.error("Preencha os campos corretamente");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      toast.error("Usuário não logado");
      return;
    }

    const date = new Date();
    const monthYear = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;

    console.log("monthYear salvo:", monthYear);
    console.log("data salva:", date.toISOString());

    try {
      setLoading(true);
      await addDoc(collection(db, `users/${user.uid}/transactions`), {
        type: isIncome ? "income" : "expense",
        value: Number(value.replace(/\./g, "").replace(",", ".")),
        description,
        category,
        date: date.toISOString(),
        monthYear,
      });
      toast.success("Transação salva!");
      setOpenModal(false);
    } catch (error) {
      toast.error("Erro ao salvar transação");
    } finally {
      setLoading(false);
    }
  }

  function formatToCurrency(input: string) {
    const cleaned = input.replace(/\D/g, "");
    const numberValue = Number(cleaned) / 100;

    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numberValue);
  }

  return (
    <div className={style.modalBackground}>
      <div className={style.modalContainer}>
        <div className={style.modalHeader}>
          <h3>Nova Transação</h3>
          <MdClose
            size={26}
            cursor="pointer"
            onClick={() => setOpenModal(false)}
          />
        </div>
        {loading ? (
          <div className={style.loadingContainer}>
            <OrbitProgress color={"#69AFF5"} size="large" />
          </div>
        ) : (
          <>
            <div className={style.categoryContainer}>
              <button
                type="button"
                onClick={() => setIsIncome(true)}
                className={`${isIncome ? style.incomeSelected : ""}`}
              >
                Receita
              </button>

              <button
                type="button"
                onClick={() => setIsIncome(false)}
                className={`${isIncome ? "" : style.expenseSelected}`}
              >
                Despesa
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className={style.inputContainer}>
                <label className={style.label}>Valor (R$)</label>
                <input
                  type="text"
                  placeholder="0,00"
                  className={style.input}
                  value={value}
                  onChange={(e) => {
                    const formatted = formatToCurrency(e.target.value);
                    setValue(formatted);
                  }}
                />
              </div>

              <label className={style.label}>Categoria</label>
              <select
                className={style.input}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {isIncome ? (
                  <>
                    <option value="">Selecione</option>
                    <option value="Salário">Salário</option>
                    <option value="Investimento">Investimento</option>
                    <option value="Renda extra">Renda extra</option>
                    <option value="Outras receitas">Outras receitas</option>
                  </>
                ) : (
                  <>
                    <option value="">Selecione</option>
                    <option value="Moradia">Moradia</option>
                    <option value="Alimentação">Alimentação</option>
                    <option value="Transporte">Transporte</option>
                    <option value="Lazer">Lazer</option>
                    <option value="Saúde">Saúde</option>
                    <option value="Educação">Educação</option>
                  </>
                )}
              </select>

              <label className={style.label}>Descrição </label>
              <input
                type="text"
                placeholder="EX: Salário, Aluguel, Supermercado..."
                className={style.input}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <button
                type="submit"
                className={isIncome ? style.saveIncome : style.saveExpense}
              >
                Salvar {isIncome ? "Receita" : "Despesa"}
              </button>
            </form>
          </>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
