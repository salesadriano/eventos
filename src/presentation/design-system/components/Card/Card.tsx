import type { FC, ReactNode } from "react";
import styles from "./Card.module.css";

export type CardVariant = "default" | "outline" | "subtle";

interface CardProps {
  title?: string;
  eyebrow?: string;
  footer?: ReactNode;
  variant?: CardVariant;
  children: ReactNode;
}

export const Card: FC<CardProps> = ({
  title,
  eyebrow,
  footer,
  variant = "default",
  children,
}) => {
  const classes = [styles.card, styles[variant]].join(" ");

  return (
    <article className={classes}>
      {(title || eyebrow) && (
        <header className={styles.header}>
          {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
          {title && <h3 className={styles.title}>{title}</h3>}
        </header>
      )}
      <div>{children}</div>
      {footer && <footer className={styles.footer}>{footer}</footer>}
    </article>
  );
};
