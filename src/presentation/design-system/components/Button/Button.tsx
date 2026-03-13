import type { ButtonHTMLAttributes, FC, ReactNode } from "react";
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "default" | "full";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children: ReactNode;
}

export const Button: FC<ButtonProps> = ({
  variant = "primary",
  size = "default",
  isLoading = false,
  disabled,
  className,
  children,
  ...props
}) => {
  const classes = [styles.button, styles[variant], styles[size], className]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={classes}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? (
        <span className={styles.labelLoading}>
          <span className={styles.spinner} aria-hidden="true" />
          Carregando...
        </span>
      ) : (
        children
      )}
    </button>
  );
};
