"use client";

import { Button } from "@nugudi/react-components-button";
import { useRouter } from "next/navigation";
import * as styles from "./index.css";

export const ProfileLogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // 로그아웃 API 호출
      await fetch("/api/auth/logout", { method: "POST" });
      // 클라이언트 사이드 네비게이션으로 로그인 페이지 이동
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // 실패해도 로그인 페이지로 이동
      router.push("/auth/login");
    }
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
