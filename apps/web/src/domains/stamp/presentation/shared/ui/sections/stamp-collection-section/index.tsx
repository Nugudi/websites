"use client";

import { Button } from "@nugudi/react-components-button";
import { Flex } from "@nugudi/react-components-layout";
import { useRouter } from "next/navigation";
import { useGetStampCollection } from "@/src/domains/stamp/presentation/client/hooks/queries/get-stamp-collection.query";
import { StampCard } from "../../components/stamp-card";
import * as styles from "./index.css";

export const StampCollectionSection = () => {
  const router = useRouter();
  const { data, isLoading, error } = useGetStampCollection();

  const handleMoveToVerifyPage = () => {
    router.push("/cafeterias/stamps/verify");
  };

  if (isLoading) {
    return (
      <Flex className={styles.container} direction="column">
        <div>로딩 중...</div>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex className={styles.container} direction="column">
        <div>스탬프를 불러오는 중 오류가 발생했습니다.</div>
      </Flex>
    );
  }

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
