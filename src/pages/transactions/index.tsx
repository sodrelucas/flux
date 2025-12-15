import { useEffect, useState } from "react";
import { db, auth } from "../../services/firebaseConnection";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

import style from "./transactions.module.css";

interface Transaction {
  id: string;
  type: "income" | "expense";
  value: number;
  description: string;
  category: string;
  monthYear: string;
  date: string;
}

interface GroupedTransactions {
  [monthYear: string]: Transaction[];
}

export function Transactions() {
  const [grouped, setGrouped] = useState<GroupedTransactions>({});

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, `users/${user.uid}/transactions`),
      orderBy("date", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Transaction, "id">),
      }));

      const groupedData: GroupedTransactions = {};
      data.forEach((item) => {
        if (!groupedData[item.monthYear]) groupedData[item.monthYear] = [];
        groupedData[item.monthYear].push(item);
      });

      setGrouped(groupedData);
    });

    return () => unsubscribe();
  }, []);

  function formatMonthYear(monthYear: string) {
    const [year, month] = monthYear.split("-");
    return `${month}/${year}`;
  }

  return (
    <div className={style.historyContainer}>
      {Object.keys(grouped).length === 0 ? (
        <p className={style.noData}>Nenhuma transação registrada.</p>
      ) : (
        Object.keys(grouped).map((month) => {
          const total = grouped[month].reduce((acc, item) => {
            return item.type === "income" ? acc + item.value : acc - item.value;
          }, 0);

          return (
            <div key={month} className={style.monthBlock}>
              <h3 className={style.monthTitle}>
                {formatMonthYear(month)}
                <span
                  className={
                    total >= 0 ? style.incomeValue : style.expenseValue
                  }
                >
                  R$ {total.toFixed(2).replace(".", ",")}
                </span>
              </h3>

              {grouped[month].map((item) => (
                <div
                  key={item.id}
                  className={
                    item.type === "income"
                      ? style.historyItemIncome
                      : style.historyItemExpense
                  }
                >
                  <p>
                    {item.category}
                    <br />
                    <span>{item.description}</span>
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
                  </p>
                </div>
              ))}
            </div>
          );
        })
      )}
    </div>
  );
}
