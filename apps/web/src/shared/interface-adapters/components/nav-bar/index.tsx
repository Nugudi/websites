"use client";

import { ArrowLeftIcon } from "@nugudi/assets-icons";
import { Button } from "@nugudi/react-components-button";
import { useRouter } from "next/navigation";
import * as styles from "./index.css";

interface NavBarProps {
  title?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  background?: "white" | "transparent" | "blur";
  padding?: "none" | "default";
}

export const NavBar = ({
  title,
  showBackButton = true,
  onBackClick,
  background,
  padding,
}: NavBarProps) => {
  const router = useRouter();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      router.back();
    }
  };

  return (
    <header className={styles.container({ background, padding })}>
      {showBackButton && (
        <Button
          size="sm"
          className={styles.backButton}
          onClick={handleBackClick}
          aria-label="뒤로 가기"
        >
          <ArrowLeftIcon />
        </Button>
      )}
      {title && <h1 className={styles.title}>{title}</h1>}
    </header>
  );
};
