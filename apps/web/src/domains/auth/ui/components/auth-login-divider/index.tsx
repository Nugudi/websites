import * as styles from "./index.css";

interface AuthLoginDividerProps {
  text?: string;
  className?: string;
}

export const AuthLoginDivider = ({
  text = "OR",
  className,
}: AuthLoginDividerProps) => {
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
