import * as React from "react";
import { toCSSValue } from "../utils/style-helpers";
import { Flex } from "./Flex";
import type { OrderedListProps } from "./types";

const OrderedList = (
  props: OrderedListProps,
  ref: React.Ref<HTMLOListElement>,
) => {
  const { spacing, children, style, ...rest } = props;

  // Process spacing value
  const processedSpacing = toCSSValue(spacing, "gap");

  return (
    <Flex
      {...rest}
      as="ol"
      ref={ref}
      direction="column"
      style={{
        ...(processedSpacing && { gap: processedSpacing }),
        listStyleType: "decimal",
        ...style,
      }}
    >
      {children}
    </Flex>
  );
};

const _OrderedList = React.forwardRef(OrderedList);
export { _OrderedList as OrderedList };
