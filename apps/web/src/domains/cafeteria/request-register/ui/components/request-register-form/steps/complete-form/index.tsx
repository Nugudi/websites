"use client";

import { Button } from "@nugudi/react-components-button";
import { Body, Box, Title, VStack } from "@nugudi/react-components-layout";
import Image from "next/image";
import { useRouter } from "next/navigation";
import * as styles from "./index.css";

export const CompleteForm = () => {
  return (
    <VStack h="full" justify="space-between" className={styles.container}>
      <CompletionMessage />
      <CompleteButton />
    </VStack>
  );
};

const CompletionMessage = () => {
  return (
    <VStack gap={32} justify="center" align="center" className={styles.content}>
      <VStack gap={4} align="center">
        <Title fontSize="t1" colorShade={800}>
          식당등록 요청을 성공했어요 !
        </Title>
        <Body fontSize="b1" colorShade={500} as="p" textAlign="center">
          등록된 식당이 승인되면
          <br />
          바로{" "}
          <Box as="span" color="main">
            20P
          </Box>
          를 지급해드려요
        </Body>
      </VStack>
      <Image
        src="/images/thanks-nuguri.png"
        alt="너구리 완료 이미지"
        width={300}
        height={220}
        priority
      />
    </VStack>
  );
};

const CompleteButton = () => {
  const router = useRouter();

  const handleConfirm = () => {
    router.replace("/");
  };
  return (
    <Button variant="brand" color="zinc" size="lg" onClick={handleConfirm}>
      확인
    </Button>
  );
};
