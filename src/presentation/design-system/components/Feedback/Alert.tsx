import type { FC, ReactNode } from "react";
import styles from "./Alert.module.css";

export type AlertVariant = "info" | "success" | "warning" | "error";

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: ReactNode;
  onClose?: () => void;
}

export const Alert: FC<AlertProps> = ({
  variant = "info",
  title,
  children,
  onClose,
}) => {
  const isAssertive = variant === "warning" || variant === "error";

  return (
    <div
      className={`${styles.alert} ${styles[variant]}`}
      role={isAssertive ? "alert" : "status"}
      aria-live={isAssertive ? "assertive" : "polite"}
    >
      {(title || onClose) && (
        <div className={styles.titleRow}>
          {title ? <p className={styles.title}>{title}</p> : <span />}
          {onClose && (
            <button
              type="button"
              className={styles.close}
              aria-label="Fechar alerta"
              onClick={onClose}
            >
              x
            </button>
          )}
        </div>
      )}
      <p className={styles.description}>{children}</p>
    </div>
  );
};
