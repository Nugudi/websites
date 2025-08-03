import type { vars } from "@nugudi/themes";
import type React from "react";
import type { AsElementProps, StyleProps } from "@/core/types";

export type BoxProps = AsElementProps & StyleProps;

export type DividerProps = {
  orientation?: "horizontal" | "vertical";
  color?: keyof typeof vars.colors.$scale;
  size?: number;
  variant?: "solid" | "dashed" | "dotted" | "double";
} & React.HTMLAttributes<HTMLHRElement>;
