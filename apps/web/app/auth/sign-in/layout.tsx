import { Flex } from "@nugudi/react-components-layout";
import type React from "react";

const LoginLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      style={{
        minHeight: "100vh",
        width: "100%",
      }}
    >
      {children}
    </Flex>
  );
};

export default LoginLayout;
