import { vars } from "@nugudi/themes";
import { clsx } from "clsx";
import * as React from "react";
import {
  toCSSValue,
  toSizeValue,
  toSpacingValue,
} from "../utils/style-helpers";
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

  // Process size values
  const processedWidth = toSizeValue(w ?? width);
  const processedHeight = toSizeValue(h ?? height);
  const processedMaxWidth = toSizeValue(maxW ?? maxWidth);
  const processedMinWidth = toSizeValue(minW ?? minWidth);
  const processedMaxHeight = toSizeValue(maxH ?? maxHeight);
  const processedMinHeight = toSizeValue(minH ?? minHeight);

  // Process size shortcuts
  const processedSize = toSizeValue(size);
  const processedMaxSize = toSizeValue(maxSize);
  const processedMinSize = toSizeValue(minSize);
  const processedSizeX = toSizeValue(sizeX);
  const processedSizeY = toSizeValue(sizeY);

  // Process margin values
  const processedMargin = toSpacingValue(m ?? margin);
  const processedMarginTop = toSpacingValue(mt ?? marginTop);
  const processedMarginRight = toSpacingValue(mr ?? marginRight);
  const processedMarginBottom = toSpacingValue(mb ?? marginBottom);
  const processedMarginLeft = toSpacingValue(ml ?? marginLeft);
  const processedMarginX = toSpacingValue(mX);
  const processedMarginY = toSpacingValue(mY);

  // Process padding values
  const processedPadding = toSpacingValue(p ?? padding);
  const processedPaddingTop = toSpacingValue(pt ?? paddingTop);
  const processedPaddingRight = toSpacingValue(pr ?? paddingRight);
  const processedPaddingBottom = toSpacingValue(pb ?? paddingBottom);
  const processedPaddingLeft = toSpacingValue(pl ?? paddingLeft);
  const processedPaddingX = toSpacingValue(pX);
  const processedPaddingY = toSpacingValue(pY);

  // Process border radius - check if it's a theme token first
  const processedBorderRadius =
    borderRadius &&
    typeof borderRadius === "string" &&
    borderRadius in vars.box.radii
      ? vars.box.radii[borderRadius as keyof typeof vars.box.radii]
      : toCSSValue(borderRadius);

  // Process box shadow - check if it's a theme token first
  const processedBoxShadow =
    boxShadow && typeof boxShadow === "string" && boxShadow in vars.box.shadows
      ? vars.box.shadows[boxShadow as keyof typeof vars.box.shadows]
      : boxShadow;

  // Build inline styles
  const inlineStyles: React.CSSProperties = {
    // Size properties
    ...(processedWidth && { width: processedWidth }),
    ...(processedHeight && { height: processedHeight }),
    ...(processedMaxWidth && { maxWidth: processedMaxWidth }),
    ...(processedMinWidth && { minWidth: processedMinWidth }),
    ...(processedMaxHeight && { maxHeight: processedMaxHeight }),
    ...(processedMinHeight && { minHeight: processedMinHeight }),

    // Size shortcuts
    ...(processedSize && {
      width: processedSize,
      height: processedSize,
    }),
    ...(processedMaxSize && {
      maxWidth: processedMaxSize,
      maxHeight: processedMaxSize,
    }),
    ...(processedMinSize && {
      minWidth: processedMinSize,
      minHeight: processedMinSize,
    }),
    ...(processedSizeX && {
      width: processedSizeX,
    }),
    ...(processedSizeY && {
      height: processedSizeY,
    }),

    // Margin properties
    ...(processedMargin && { margin: processedMargin }),
    ...(processedMarginTop && { marginTop: processedMarginTop }),
    ...(processedMarginRight && { marginRight: processedMarginRight }),
    ...(processedMarginBottom && { marginBottom: processedMarginBottom }),
    ...(processedMarginLeft && { marginLeft: processedMarginLeft }),
    ...(processedMarginX && {
      marginLeft: processedMarginX,
      marginRight: processedMarginX,
    }),
    ...(processedMarginY && {
      marginTop: processedMarginY,
      marginBottom: processedMarginY,
    }),

    // Padding properties
    ...(processedPadding && { padding: processedPadding }),
    ...(processedPaddingTop && { paddingTop: processedPaddingTop }),
    ...(processedPaddingRight && { paddingRight: processedPaddingRight }),
    ...(processedPaddingBottom && { paddingBottom: processedPaddingBottom }),
    ...(processedPaddingLeft && { paddingLeft: processedPaddingLeft }),
    ...(processedPaddingX && {
      paddingLeft: processedPaddingX,
      paddingRight: processedPaddingX,
    }),
    ...(processedPaddingY && {
      paddingTop: processedPaddingY,
      paddingBottom: processedPaddingY,
    }),

    // Other properties
    ...(processedBorderRadius && { borderRadius: processedBorderRadius }),
    ...(processedBoxShadow && { boxShadow: processedBoxShadow }),

    // Color properties
    ...(color && { color: vars.colors.$scale?.[color]?.[500] }),
    ...(background && { background: vars.colors.$scale?.[background]?.[500] }),

    // Merge with provided style
    ...style,
  };

  return React.createElement(
    as,
    {
      ...restProps,
      ref,
      className: clsx(className),
      style: inlineStyles,
    },
    children,
  );
};

const _Box = React.forwardRef(Box);
export { _Box as Box };
