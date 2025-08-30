import { vars } from "@nugudi/themes";
import { clsx } from "clsx";
import * as React from "react";
import { BaseStyle, StyleSprinkles } from "../core/style.css";
import type { GridItemProps } from "./types";

const GridItem = (props: GridItemProps, ref: React.Ref<HTMLElement>) => {
  const {
    as = "div",
    color,
    background,
    children,
    area,
    colEnd,
    colStart,
    colSpan,
    rowEnd,
    rowStart,
    rowSpan,
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
  };

  return React.createElement(
    as,
    {
      ...restProps,
      ref,
      className: clsx([BaseStyle, StyleSprinkles(sprinkleProps), className]),
      style: {
        gridArea: area,
        gridColumnEnd: colEnd,
        gridColumnStart: colStart,
        gridColumn: colSpan,
        gridRowEnd: rowEnd,
        gridRowStart: rowStart,
        gridRow: rowSpan,
        color: color && vars.colors.$scale?.[color]?.[700],
        background: background && vars.colors.$scale?.[background]?.[100],
        ...style,
      },
    },
    children,
  );
};

const _GridItem = React.forwardRef(GridItem);
export { _GridItem as GridItem };
