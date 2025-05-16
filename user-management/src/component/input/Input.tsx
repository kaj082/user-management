import React from "react";
import styles from "./Input.module.scss";

interface Props {
  type: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setError?: (error: string) => void;
  error?: string;
}

const Input = (props: Props) => {
  const { type, error, inputProps, onChange, placeholder, value } = props;
  return (
    <div className={styles.inputContainer}>
      <input
        className={`${styles.input} ${error ? styles.errorInput : ""}`}
        type={type}
        {...inputProps}
        onChange={onChange}
        placeholder={placeholder}
        value={value}
      />
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default Input;
