import type { FC } from "react";
import styles from "./LoadingState.module.css";

type LoadingVariant = "spinner" | "skeleton";
type SpinnerSize = "sm" | "md" | "lg";

interface LoadingStateProps {
  variant?: LoadingVariant;
  size?: SpinnerSize;
  message?: string;
  lines?: number;
}

export const LoadingState: FC<LoadingStateProps> = ({
  variant = "spinner",
  size = "md",
  message = "Carregando...",
  lines = 3,
}) => {
  if (variant === "skeleton") {
    const safeLines = Math.max(1, lines);

    return (
      <div className={styles.root} aria-live="polite" aria-busy="true">
        <div className={`${styles.skeleton} ${styles.block}`} />
        {Array.from({ length: safeLines }).map((_, index) => (
          <div key={index} className={`${styles.skeleton} ${styles.line}`} />
        ))}
      </div>
    );
  }

  return (
    <div
      className={styles.spinnerRow}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span
        className={`${styles.spinner} ${styles[size]}`}
        aria-hidden="true"
      />
      <span>{message}</span>
    </div>
  );
};
