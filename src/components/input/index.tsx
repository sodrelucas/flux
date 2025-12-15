import style from "./input.module.css";

interface InputProps {
  type: string;
  placeholder: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Input({
  type,
  placeholder,
  label,
  value,
  onChange,
}: InputProps) {
  return (
    <div className={style.inputContainer}>
      <label className={style.label}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className={style.input}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
