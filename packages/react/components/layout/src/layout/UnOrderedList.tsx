import * as React from "react";
import { toCSSValue } from "../utils/style-helpers";
import { Flex } from "./Flex";
import type { UnorderedListProps } from "./types";

const UnorderedList = (
  props: UnorderedListProps,
  ref: React.Ref<HTMLUListElement>,
) => {
  const { listStyleType = "disc", spacing, children, style, ...rest } = props;

  // Process spacing value
  const processedSpacing = toCSSValue(spacing, "gap");

  return (
    <Flex
      {...rest}
      as="ul"
      ref={ref}
      direction="column"
      style={{
        ...(processedSpacing && { gap: processedSpacing }),
        listStyleType: listStyleType as string,
        ...style,
      }}
    >
      {children}
    </Flex>
  );
};

const _UnorderedList = React.forwardRef(UnorderedList);
export { _UnorderedList as UnorderedList };
