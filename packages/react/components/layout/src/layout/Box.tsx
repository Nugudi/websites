import { vars } from "@nugudi/themes";
import { clsx } from "clsx";
import * as React from "react";
import { BaseStyle, StyleSprinkles } from "../core/style.css";
import type { BoxProps } from "./types";

const Box = (props: BoxProps, ref: React.Ref<HTMLElement>) => {
  const {
    as = "div",
    color,
    background,
    // Width and height properties with shorthands
    width,
    w,
    height,
    h,
    maxWidth,
    maxW,
    minWidth,
    minW,
    maxHeight,
    maxH,
    minHeight,
    minH,
    size,
    maxSize,
    minSize,
    sizeX,
    sizeY,
    // Margin and padding properties with shorthands
    m,
    margin,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    mt,
    mr,
    mb,
    ml,
    mX,
    mY,
    p,
    padding,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    pt,
    pr,
    pb,
    pl,
    pX,
    pY,
    // Other style properties
    borderRadius,
    boxShadow,
    children,
    className,
    style,
    ...restProps
  } = props;

  const sprinkleProps = {
    // Width and height properties
    width,
    w,
    height,
    h,
    maxWidth,
    maxW,
    minWidth,
    minW,
    maxHeight,
    maxH,
    minHeight,
    minH,
    size,
    maxSize,
    minSize,
    sizeX,
    sizeY,
    // Margin and padding properties
    m,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    mt,
    mr,
    mb,
    ml,
    mX,
    mY,
    p,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    pt,
    pr,
    pb,
    pl,
    pX,
    pY,
    // Other style properties
    borderRadius,
    boxShadow,
  };

  return React.createElement(
    as,
    {
      ...restProps,
      ref,
      className: clsx([BaseStyle, StyleSprinkles(sprinkleProps), className]),
      style: {
        color: color && vars.colors.$scale?.[color]?.[500],
        background: background && vars.colors.$scale?.[background]?.[500],
        ...style,
      },
    },
    children,
  );
};

const _Box = React.forwardRef(Box);
export { _Box as Box };
