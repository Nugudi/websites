import * as React from "react";
import { toCSSValue } from "../utils/style-helpers";
import { Box } from "./Box";
import type { FlexProps } from "./types";

const Flex = (props: FlexProps, ref: React.Ref<HTMLElement>) => {
  const {
    align,
    basis,
    direction,
    grow,
    justify,
    shrink,
    wrap,
    gap,
    children,
    style,
    ...boxProps
  } = props;

  // Process gap value
  const processedGap = toCSSValue(gap, "gap");

  return (
    <Box
      {...boxProps}
      ref={ref}
      style={{
        display: "flex",
        alignItems: align,
        flexBasis: basis,
        flexDirection: direction,
        flexGrow: grow,
        justifyContent: justify,
        flexShrink: shrink,
        flexWrap: wrap,
        ...(processedGap && { gap: processedGap }),
        ...style,
      }}
    >
      {children}
    </Box>
  );
};

const _Flex = React.forwardRef(Flex);
export { _Flex as Flex };
