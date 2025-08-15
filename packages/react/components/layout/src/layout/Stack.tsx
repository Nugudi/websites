import { vars } from "@nugudi/themes";
import clsx from "clsx";
import React from "react";
import { BaseStyle, StyleSprinkles } from "@/core/style.css";
import type { FlexProps as StackProps } from "@/layout/types";
import { extractSprinkleProps } from "@/utils/properties";

const Stack = (props: StackProps, ref: React.Ref<HTMLElement>) => {
  const {
    as = "div",
    color,
    background,
    direction,
    align,
    basis,
    grow,
    justify,
    shrink,
    wrap,
    gap,
    children,
  } = props;

  return React.createElement(
    as,
    {
      ...props,
      ref,
      className: clsx([
        BaseStyle,
        StyleSprinkles(
          extractSprinkleProps(props, Array.from(StyleSprinkles.properties)),
        ),
      ]),
      style: {
        display: "flex",
        alignItems: align,
        justifyContent: justify,
        flexDirection: direction,
        flexWrap: wrap,
        flexGrow: grow,
        flexShrink: shrink,
        flexBasis: basis,
        gap,
        color: color && vars.colors.$scale?.[color]?.[700],
        background: background && vars.colors.$scale?.[background]?.[100],
        ...props.style,
      },
    },
    children,
  );
};

const _Stack = React.forwardRef(Stack);
export { _Stack as Stack };
