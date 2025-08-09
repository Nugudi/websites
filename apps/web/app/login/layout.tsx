import { Flex } from "@nugudi/react-components-layout";
import { vars } from "@nugudi/themes";
import type React from "react";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      style={{
        minHeight: "100vh",
        width: "100%",
        background: vars.colors.$static.light.gradient.linearGreen,
      }}
    >
      {children}
    </Flex>
  );
}
