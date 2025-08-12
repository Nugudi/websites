import { Flex } from "@nugudi/react-components-layout";
import type React from "react";
import * as styles from "./layout.css";

const LoginLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      className={styles.container}
    >
      {children}
    </Flex>
  );
};

export default LoginLayout;
