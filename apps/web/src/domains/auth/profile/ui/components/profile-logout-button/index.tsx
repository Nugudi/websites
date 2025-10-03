"use client";

import { Button } from "@nugudi/react-components-button";
import * as styles from "./index.css";

export const ProfileLogoutButton = () => {
  const handleLogout = () => {
    // TODO: 로그아웃 API 호출
    window.location.href = "/api/auth/logout";
  };

  return (
    <Button
      variant="neutral"
      size="sm"
      color={"whiteAlpha"}
      onClick={handleLogout}
      className={styles.buttonBox}
    >
      로그아웃
    </Button>
  );
};
