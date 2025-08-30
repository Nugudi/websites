"use client";

import { Button } from "@nugudi/react-components-button";
import { HStack } from "@nugudi/react-components-layout";
import { useRouter, useSearchParams } from "next/navigation";
import * as styles from "./index.css";

export const CafeteriaViewToggle = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get("view") || "favorites";

  const handleViewChange = (viewType: string) => {
    router.push(`?view=${viewType}`);
  };

  return (
    <HStack>
      <Button
        size="sm"
        color="whiteAlpha"
        className={view === "favorites" ? styles.buttonActive : styles.button}
        onClick={() => handleViewChange("favorites")}
      >
        즐겨찾기
      </Button>
      <Button
        size="sm"
        color="whiteAlpha"
        className={view === "all" ? styles.buttonActive : styles.button}
        onClick={() => handleViewChange("all")}
      >
        전체보기
      </Button>
    </HStack>
  );
};
