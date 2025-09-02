import React from "react";
import type { FlexProps as StackProps } from "@/layout/types";
import { Flex } from "./Flex";

const Stack = (props: StackProps, ref: React.Ref<HTMLElement>) => {
  // Stack is just an alias for Flex with configurable direction
  return <Flex {...props} ref={ref} />;
};

const _Stack = React.forwardRef(Stack);
export { _Stack as Stack };
