"use client";

import { Flex } from "@nugudi/react-components-layout";
import { NavBar } from "@/src/shared/ui/components/nav-bar";
import { RequestRegisterSection } from "../../sections/request-register-section";
import * as styles from "./index.css";

export const RequestRegisterView = () => {
  return (
    <Flex
      direction="column"
      w="full"
      h="full"
      minH="100dvh"
      p={16}
      gap={16}
      className={styles.container}
    >
      <NavBar />
      <RequestRegisterSection />
    </Flex>
  );
};
