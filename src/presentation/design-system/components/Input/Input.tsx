import { useId, type FC, type InputHTMLAttributes } from "react";
import styles from "./Input.module.css";

type InputState = "default" | "success" | "error" | "warning";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: string;
  errorMessage?: string;
  state?: InputState;
}

export const Input: FC<InputProps> = ({
  label,
  helperText,
  errorMessage,
  id,
  state = "default",
  ...props
}) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const describedBy = errorMessage
    ? `${inputId}-error`
    : helperText
      ? `${inputId}-helper`
      : undefined;

  const classes = [styles.input, state !== "default" ? styles[state] : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <label className={styles.field} htmlFor={inputId}>
      <span className={styles.label}>{label}</span>
      <input
        id={inputId}
        className={classes}
        aria-invalid={Boolean(errorMessage)}
        aria-describedby={describedBy}
        {...props}
      />
      {errorMessage ? (
        <p id={`${inputId}-error`} className={styles.errorText}>
          {errorMessage}
        </p>
      ) : (
        helperText && (
          <p id={`${inputId}-helper`} className={styles.helper}>
            {helperText}
          </p>
        )
      )}
    </label>
  );
};
