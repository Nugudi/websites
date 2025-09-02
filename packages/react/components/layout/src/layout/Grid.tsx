import * as React from "react";
import { toCSSValue } from "../utils/style-helpers";
import { Box } from "./Box";
import type { GridProps } from "./types";

const Grid = (props: GridProps, ref: React.Ref<HTMLElement>) => {
  const {
    children,
    autoColumns,
    autoFlow,
    autoRows,
    columnGap,
    column,
    gap,
    row,
    rowGap,
    templateColumns,
    templateRows,
    templateAreas,
    style,
    ...boxProps
  } = props;

  // Process gap values
  const processedGap = toCSSValue(gap, "gap");
  const processedColumnGap = toCSSValue(columnGap, "gap");
  const processedRowGap = toCSSValue(rowGap, "gap");

  return (
    <Box
      {...boxProps}
      ref={ref}
      style={{
        display: "grid",
        gridAutoColumns: autoColumns,
        gridAutoFlow: autoFlow,
        gridAutoRows: autoRows,
        gridColumn: column,
        gridRow: row,
        gridTemplateColumns: templateColumns,
        gridTemplateRows: templateRows,
        gridTemplateAreas: templateAreas,
        ...(processedGap && { gap: processedGap }),
        ...(processedColumnGap && { columnGap: processedColumnGap }),
        ...(processedRowGap && { rowGap: processedRowGap }),
        ...style,
      }}
    >
      {children}
    </Box>
  );
};

const _Grid = React.forwardRef(Grid);
export { _Grid as Grid };
