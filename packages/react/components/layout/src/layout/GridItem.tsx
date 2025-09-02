import * as React from "react";
import { Box } from "./Box";
import type { GridItemProps } from "./types";

const GridItem = (props: GridItemProps, ref: React.Ref<HTMLElement>) => {
  const {
    children,
    area,
    colEnd,
    colStart,
    colSpan,
    rowEnd,
    rowStart,
    rowSpan,
    style,
    ...boxProps
  } = props;

  return (
    <Box
      {...boxProps}
      ref={ref}
      style={{
        gridArea: area,
        gridColumnEnd: colEnd,
        gridColumnStart: colStart,
        gridColumn: colSpan,
        gridRowEnd: rowEnd,
        gridRowStart: rowStart,
        gridRow: rowSpan,
        ...style,
      }}
    >
      {children}
    </Box>
  );
};

const _GridItem = React.forwardRef(GridItem);
export { _GridItem as GridItem };
