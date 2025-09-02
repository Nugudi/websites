import type { vars } from "@nugudi/themes";
import type React from "react";
import type { CSSProperties } from "react";
import type { AsElementProps, SpacingValue, StyleProps } from "@/core/types";

export type BoxProps = AsElementProps & StyleProps;

export type DividerProps = {
  orientation?: "horizontal" | "vertical";
  color?: keyof typeof vars.colors.$scale;
  size?: number;
  variant?: "solid" | "dashed" | "dotted" | "double";
} & React.HTMLAttributes<HTMLHRElement>;

export type FlexProps = {
  align?: CSSProperties["alignItems"];
  basis?: CSSProperties["flexBasis"];
  direction?: CSSProperties["flexDirection"];
  grow?: CSSProperties["flexGrow"];
  justify?: CSSProperties["justifyContent"];
  shrink?: CSSProperties["flexShrink"];
  wrap?: CSSProperties["flexWrap"];
  gap?: SpacingValue | CSSProperties["gap"];
} & BoxProps;

export type GridProps = {
  autoColumns?: CSSProperties["gridAutoColumns"];
  autoFlow?: CSSProperties["gridAutoFlow"];
  autoRows?: CSSProperties["gridAutoRows"];
  column?: CSSProperties["gridColumn"];
  columnGap?: SpacingValue | CSSProperties["columnGap"];
  gap?: SpacingValue | CSSProperties["gap"];
  row?: CSSProperties["gridRow"];
  rowGap?: SpacingValue | CSSProperties["rowGap"];
  templateAreas?: CSSProperties["gridTemplateAreas"];
  templateColumns?: CSSProperties["gridTemplateColumns"];
  templateRows?: CSSProperties["gridTemplateRows"];
} & BoxProps;

export type GridItemProps = {
  area?: CSSProperties["gridArea"];
  colEnd?: CSSProperties["gridColumnEnd"];
  colStart?: CSSProperties["gridColumnStart"];
  colSpan?: CSSProperties["gridColumn"];
  rowEnd?: CSSProperties["gridRowEnd"];
  rowStart?: CSSProperties["gridRowStart"];
  rowSpan?: CSSProperties["gridRow"];
} & BoxProps;

export type ListProps = {
  variant?: "unordered" | "ordered";
  spacing?: SpacingValue;
} & BoxProps;

export type OrderedListProps = Omit<ListProps, "variant">;
export type ListItemProps = BoxProps;

export type UnorderedListProps = Omit<ListProps, "variant"> & {
  listStyleType?: CSSProperties["listStyleType"];
};
