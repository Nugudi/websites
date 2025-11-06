"use client";

import { Button } from "@nugudi/react-components-button";
import { Flex } from "@nugudi/react-components-layout";
import { useRouter } from "next/navigation";
import { useGetStampCollection } from "../../../hooks/queries/get-stamp-collection.query";
import { StampCard } from "../../components/stamp-card";
import * as styles from "./index.css";

export const StampCollectionSection = () => {
  const router = useRouter();
  // Custom hook으로 데이터 fetch
  // Repository에서 이미 UI-ready data로 변환되어 반환됨
  const { data, isLoading, error } = useGetStampCollection();

  const handleMoveToVerifyPage = () => {
    router.push("/cafeterias/stamps/verify");
  };

  // Loading state
  if (isLoading) {
    return (
      <Flex className={styles.container} direction="column">
        <div>로딩 중...</div>
      </Flex>
    );
  }

  // Error state
  if (error) {
    return (
      <Flex className={styles.container} direction="column">
        <div>스탬프를 불러오는 중 오류가 발생했습니다.</div>
      </Flex>
    );
  }

  // Empty state - 스탬프가 없는 경우에도 UI는 표시
  const stamps = data?.stamps ?? [];

  return (
    <Flex className={styles.container} direction="column">
      <StampCard stamps={stamps} />

      <Button
        variant="brand"
        width="full"
        color="main"
        size="lg"
        onClick={handleMoveToVerifyPage}
      >
        인증하기
      </Button>
    </Flex>
  );
};
