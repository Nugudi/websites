import * as styles from "./index.css";

interface LoginDividerProps {
  text?: string;
  className?: string;
}

export const LoginDivider = ({ text = "OR", className }: LoginDividerProps) => {
  return (
    <div
      className={`${styles.container} ${className || ""}`}
      role="presentation"
    >
      <hr className={styles.divider} />
      <span className={styles.text}>{text}</span>
      <hr className={styles.divider} />
    </div>
  );
};
