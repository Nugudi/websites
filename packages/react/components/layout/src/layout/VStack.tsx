import { vars } from "@nugudi/themes";
import clsx from "clsx";
import React from "react";
import { BaseStyle, StyleSprinkles } from "@/core/style.css";
import type { FlexProps as VStackProps } from "@/layout/types";
import { extractSprinkleProps } from "@/utils/properties";

const VStack = (props: VStackProps, ref: React.Ref<HTMLElement>) => {
  const {
    as = "div",
    color,
    background,
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
        flexDirection: "column",
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

const _VStack = React.forwardRef(VStack);
export { _VStack as VStack };
