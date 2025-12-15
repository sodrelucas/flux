import { useEffect, useState } from "react";
import style from "./donutChart.module.css";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { db, auth } from "../../services/firebaseConnection";
import { collection, query, where, onSnapshot } from "firebase/firestore";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Transaction {
  id: string;
  type: string;
  value: number;
  category: string;
  monthYear: string;
}

export default function DespesasPorCategoria() {
  const categorias = [
    "Moradia",
    "Alimentação",
    "Transporte",
    "Lazer",
    "Saúde",
    "Educação",
  ];
  const [valores, setValores] = useState<number[]>(
    new Array(categorias.length).fill(0)
  );

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const date = new Date();
    const monthYear = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;

    const q = query(
      collection(db, `users/${user.uid}/transactions`),
      where("monthYear", "==", monthYear)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Transaction[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Transaction[];

      const despesas = data.filter((t) => t.type === "expense");

      const valoresPorCategoria = categorias.map((cat) =>
        despesas
          .filter((d) => d.category === cat)
          .reduce((acc, cur) => acc + cur.value, 0)
      );

      setValores(valoresPorCategoria);
    });

    return () => unsubscribe();
  }, []);

  const total = valores.reduce((acc, val) => acc + val, 0);
  const porcentagens =
    total > 0
      ? valores.map((v) => ((v / total) * 100).toFixed(1))
      : new Array(categorias.length).fill("0.0");

  const data = {
    labels: categorias,
    datasets: [
      {
        data: valores,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: "70%",
    plugins: { legend: { display: false } },
  };

  return (
    <div className={style.container}>
      <h3>Despesas por Categoria</h3>
      {total === 0 ? (
        <p className={style.noData}>Nenhuma transação este mês.</p>
      ) : (
        <div className={style.donutContainer}>
          <div style={{ width: "200px" }}>
            <Doughnut data={data} options={options} />
          </div>
          <div>
            {categorias.map((cat, index) => (
              <div key={cat} className={style.donutCategory}>
                <span>
                  <span
                    style={{
                      width: "14px",
                      height: "14px",
                      borderRadius: "50%",
                      display: "inline-block",
                      marginRight: "6px",
                      backgroundColor: data.datasets[0].backgroundColor[index],
                    }}
                  ></span>{" "}
                  {cat}:
                </span>
                <span>
                  <strong>{porcentagens[index]}%</strong>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
