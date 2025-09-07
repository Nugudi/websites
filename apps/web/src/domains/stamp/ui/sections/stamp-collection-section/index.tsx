"use client";

import { Button } from "@nugudi/react-components-button";
import { Flex } from "@nugudi/react-components-layout";
import { useRouter } from "next/navigation";
import { StampCard } from "@/src/domains/stamp/ui/components/stamp-card";
import * as styles from "./index.css";

export const StampCollectionSection = () => {
  const router = useRouter();

  const handleMoveToVerifyPage = () => {
    router.push("/cafeterias/stamps/verify");
  };

  return (
    <Flex className={styles.container} direction="column">
      <StampCard />

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
