import React from "react";
import type { FlexProps as VStackProps } from "@/layout/types";
import { Flex } from "./Flex";

const VStack = (props: VStackProps, ref: React.Ref<HTMLElement>) => {
  const { children, ...restProps } = props;

  return (
    <Flex {...restProps} ref={ref} direction="column">
      {children}
    </Flex>
  );
};

const _VStack = React.forwardRef(VStack);
export { _VStack as VStack };
