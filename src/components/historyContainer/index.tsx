import { useEffect, useState } from "react";
import { db, auth } from "../../services/firebaseConnection";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { MdDeleteOutline } from "react-icons/md";
import style from "./historyContainer.module.css";

interface Transaction {
  id: string;
  type: "income" | "expense";
  value: number;
  description: string;
  category: string;
  date: string;
}

interface TransactionProps {
  title: string | null;
}

export function HistoryContainer({ title }: TransactionProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const date = new Date();
    const monthYear = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;

    const q = query(
      collection(db, `users/${user.uid}/transactions`),
      where("monthYear", "==", monthYear),
      orderBy("date", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Transaction, "id">),
      }));
      setTransactions(data);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await deleteDoc(doc(db, `users/${user.uid}/transactions`, id));
    } catch (error) {
      console.error("Erro ao deletar transação:", error);
    }
  };

  return (
    <div className={style.historyContainer}>
      <h3 className={style.historyTitle}>{title}</h3>
      <div className={style.historyList}>
        {transactions.length > 0 ? (
          transactions.map((item) => (
            <div
              key={item.id}
              className={
                item.type === "income"
                  ? style.historyItemIncome
                  : style.historyItemExpense
              }
            >
              <p>
                {item.category} <br />
                <span>{`${item.description}`}</span>
              </p>
              <p
                className={
                  item.type === "income"
                    ? style.incomeValue
                    : style.expenseValue
                }
              >
                {item.type === "income" ? "+ R$" : "- R$"}
                {item.value.toFixed(2).replace(".", ",")}
                <MdDeleteOutline
                  size={24}
                  cursor="pointer"
                  onClick={() => handleDelete(item.id)}
                  style={{ marginLeft: "8px" }}
                />
              </p>
            </div>
          ))
        ) : (
          <p className={style.noData}>Nenhuma transação este mês.</p>
        )}
      </div>
    </div>
  );
}
