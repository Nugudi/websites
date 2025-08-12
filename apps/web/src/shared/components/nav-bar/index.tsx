"use client";

import { ArrowLeftIcon } from "@nugudi/assets-icons";
import { Button } from "@nugudi/react-components-button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as styles from "./index.css";

const NAVBAR_SHOW_SCROLL_THRESHOLD = 10;
const NAVBAR_HIDE_SCROLL_THRESHOLD = 56;

interface NavBarProps {
  title?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  autoHide?: boolean;
}

const NavBar = ({
  title,
  showBackButton = true,
  onBackClick,
  autoHide = true,
}: NavBarProps) => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      router.back();
    }
  };

  useEffect(() => {
    if (!autoHide) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (
        currentScrollY < lastScrollY ||
        currentScrollY < NAVBAR_SHOW_SCROLL_THRESHOLD
      ) {
        setIsVisible(true);
      } else if (
        currentScrollY > lastScrollY &&
        currentScrollY > NAVBAR_HIDE_SCROLL_THRESHOLD
      ) {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, autoHide]);

  return (
    <header
      className={`${styles.container} ${!isVisible ? styles.hidden : ""}`}
    >
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

export default NavBar;
