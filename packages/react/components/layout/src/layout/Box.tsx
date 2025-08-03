import { vars } from "@nugudi/themes";
import { clsx } from "clsx";
import * as React from "react";
import { BaseStyle, StyleSprinkles } from "../core/style.css";
import { extractSprinkleProps } from "../utils/properties";
import type { BoxProps } from "./types";

const Box = (props: BoxProps, ref: React.Ref<HTMLElement>) => {
  const {
    as = "div",
    color,
    background,
    borderRadius,
    padding,
    children,
    ...restProps
  } = props;

  return React.createElement(
    as,
    {
      ...restProps,
      ref,
      className: clsx([
        BaseStyle,
        StyleSprinkles(
          extractSprinkleProps(props, Array.from(StyleSprinkles.properties)),
        ),
        props.className,
      ]),
      style: {
        color: color && vars.colors.$scale?.[color]?.[500],
        background: background && vars.colors.$scale?.[background]?.[500],
        borderRadius: borderRadius && vars.box.radii?.[borderRadius],
        padding: padding && vars.box.spacing?.[padding],
        ...props.style,
      },
    },
    children,
  );
};

const _Box = React.forwardRef(Box);
export { _Box as Box };
