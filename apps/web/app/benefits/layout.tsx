import { Flex } from "@nugudi/react-components-layout";
import type React from "react";
import { TabBar } from "@/src/shared/components/tab-bar";

const BenefitsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Flex
      direction="column"
      align="center"
      justify="space-between"
      style={{
        minHeight: "100dvh",
        height: "100%",
        width: "100%",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        {children}
      </div>
      <TabBar />
    </Flex>
  );
};

export default BenefitsLayout;
