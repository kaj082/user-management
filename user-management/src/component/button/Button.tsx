import React from "react";
import styles from "./Button.module.scss";

interface Props {
  isLoading: boolean;
  buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  btnText?: string;
  type: "primary" | "secondary";
  className?: string;
}

const Button = (props: Props) => {
  const { isLoading, className, buttonProps, btnText, type } = props;
  return (
    <button
      className={`${className} ${styles.button} ${
        type === "primary" ? styles.primary : styles.secondary
      }`}
      {...buttonProps}
    >
      {isLoading ? (
        <span className={styles.loader}></span>
      ) : (
        <p className={styles.btnText}>{btnText}</p>
      )}
    </button>
  );
};

export default Button;
