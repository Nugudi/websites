import { clsx } from "clsx";
import * as styles from "./style.css";
import type { BadgeProps } from "./types";

const Badge = ({
  children,
  tone = "neutral",
  variant = "weak",
  size = "sm",
  icon,
  className,
}: BadgeProps) => {
  const toneVariantKey = `${tone}-${variant}` as const;

  return (
    <span
      className={clsx(
        styles.badgeBase,
        styles.badgeToneVariant[toneVariantKey],
        styles.badgeSize[size],
        className,
      )}
    >
      {icon && <span className={styles.badgeIcon}>{icon}</span>}
      <span className={styles.badgeText}>{children}</span>
    </span>
  );
};

export { Badge };
