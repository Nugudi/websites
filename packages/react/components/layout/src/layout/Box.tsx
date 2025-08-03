import { vars } from "@nugudi/themes";
import clsx from "clsx";
import React from "react";
import { BaseStyle, StyleSprinkles } from "@/core/style.css";
import type { BoxProps } from "@/layout/types";
import { extractSprinkleProps } from "@/utils/properties";

const Box = (props: BoxProps, ref: React.Ref<HTMLDivElement>) => {
  const { as = "div", color, background, children } = props;
  return React.createElement(as, {
    ...props,
    ref,
    className: clsx([
      BaseStyle,
      StyleSprinkles(
        extractSprinkleProps(props, Array.from(StyleSprinkles.properties)),
      ),
      props.className,
    ]),
    style: {
      color: color && vars.colors.$scale?.[color]?.[700],
      background: background && vars.colors.$scale?.[background]?.[100],
      ...props.style,
    },
    children,
  });
};

const _Box = React.forwardRef(Box);
export { _Box as Box };
