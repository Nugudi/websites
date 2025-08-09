import * as styles from "./divider-with-text.css";

interface DividerWithTextProps {
  text?: string;
  className?: string;
}

export const DividerWithText = ({
  text = "OR",
  className,
}: DividerWithTextProps) => {
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
