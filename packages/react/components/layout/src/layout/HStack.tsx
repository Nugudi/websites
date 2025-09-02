import React from "react";
import type { FlexProps as HStackProps } from "@/layout/types";
import { Flex } from "./Flex";

const HStack = (props: HStackProps, ref: React.Ref<HTMLElement>) => {
  const { children, ...restProps } = props;

  return (
    <Flex {...restProps} ref={ref} direction="row">
      {children}
    </Flex>
  );
};

const _HStack = React.forwardRef(HStack);
export { _HStack as HStack };
