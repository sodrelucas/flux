import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../services/firebaseConnection";
import { HistoryContainer } from "../../components/historyContainer";
import ValueCards from "../../components/valueCards";
import { TransactionModal } from "../../components/transactionModal";
import DonutChart from "../../components/donutChart";
import { MdOutlineAdd } from "react-icons/md";
import style from "./dashboard.module.css";

interface Transaction {
  id: string;
  type: "income" | "expense";
  value: number;
  description: string;
  category: string;
  date: string;
  monthYear: string;
}

interface Totals {
  entradas: number;
  despesas: number;
  saldo: number;
}

export default function dashboard() {
  const [openModal, setOpenModal] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totals, setTotals] = useState<Totals>({
    entradas: 0,
    despesas: 0,
    saldo: 0,
  });

  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(
      collection(db, `users/${user.uid}/transactions`),
      (snapshot) => {
        const data: Transaction[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Transaction, "id">),
        }));
        setTransactions(data);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const currentMonthYear = new Date().toISOString().slice(0, 7);

  useEffect(() => {
    const monthTransactions = transactions.filter(
      (t) => t.monthYear === currentMonthYear
    );

    const entradas = monthTransactions
      .filter((t) => t.type === "income")
      .reduce((acc, curr) => acc + curr.value, 0);

    const despesas = monthTransactions
      .filter((t) => t.type === "expense")
      .reduce((acc, curr) => acc + curr.value, 0);

    setTotals({
      entradas,
      despesas,
      saldo: entradas - despesas,
    });
  }, [transactions, currentMonthYear]);

  return (
    <div>
      <ValueCards
        expense={totals.despesas}
        income={totals.entradas}
        totalIncome={totals.saldo}
      />
      <HistoryContainer title="Transações Recentes" />
      {openModal && <TransactionModal setOpenModal={setOpenModal} />}
      <button
        className={`${style.newOperationBtn} ${
          openModal && style.newOperationBtnIndex
        }`}
        onClick={() => setOpenModal(true)}
      >
        <MdOutlineAdd />
        <span>Nova Transação</span>
      </button>
      <DonutChart />
    </div>
  );
}
