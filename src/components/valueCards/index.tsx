import style from "./ValueCards.module.css";

interface ValueCardsProps {
  totalIncome: number;
  income: number;
  expense: number;
}

export default function ValueCards({
  totalIncome,
  income,
  expense,
}: ValueCardsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div>
      <div className={style.cardContainer}>
        <div className={style.card}>
          <p className={style.cardCategory}>saldo atual</p>
          <h3 className={style.cardValue}>{formatCurrency(totalIncome)}</h3>
        </div>
        <div className={style.card}>
          <p className={style.cardCategory}>Receitas</p>
          <h3 className={`${style.cardValue} ${style.income}`}>
            {formatCurrency(income)}
          </h3>
        </div>
        <div className={style.card}>
          <p className={style.cardCategory}>Despesas</p>
          <h3 className={`${style.cardValue} ${style.expenses}`}>
            {formatCurrency(expense)}
          </h3>
        </div>
      </div>
    </div>
  );
}
