import type { vars } from "@nugudi/themes";
import type React from "react";
import type { CSSProperties } from "react";
import type { AsElementProps, StyleProps } from "@/core/types";

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
  gap?: CSSProperties["gap"];
} & BoxProps;

export type GridProps = {
  autoColumns?: CSSProperties["gridAutoColumns"];
  autoFlow?: CSSProperties["gridAutoFlow"];
  autoRows?: CSSProperties["gridAutoRows"];
  column?: CSSProperties["gridColumn"];
  columnGap?: CSSProperties["columnGap"];
  gap?: CSSProperties["gap"];
  row?: CSSProperties["gridRow"];
  rowGap?: CSSProperties["rowGap"];
  templateAreas?: CSSProperties["gridTemplateAreas"];
  templateColumns?: CSSProperties["gridTemplateColumns"];
  templateRows?: CSSProperties["gridTemplateRows"];
} & BoxProps;
