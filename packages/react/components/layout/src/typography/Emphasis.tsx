import { vars } from "@nugudi/themes";
import clsx from "clsx";
import type { Ref } from "react";
import React, { forwardRef } from "react";
import { BaseStyle, StyleSprinkles } from "@/core/style.css";
import { emphasisStyle } from "@/typography/style.css";
import type { EmphasisProps } from "@/typography/types";
import { extractSprinkleProps } from "@/utils/properties";

const Emphasis = (props: EmphasisProps, ref: Ref<HTMLElement>) => {
  const {
    as = "em",
    fontSize = "e1",
    color = "zinc",
    colorShade = 600,
    textAlign = "left",
    children,
    className,
    style,
    ...domProps
  } = props;

  return React.createElement(
    as,
    {
      ...domProps,
      ref,
      className: clsx([
        BaseStyle,
        StyleSprinkles(
          extractSprinkleProps(props, Array.from(StyleSprinkles.properties)),
        ),
        emphasisStyle({
          fontSize,
        }),
        className,
      ]),
      style: {
        color: color && vars.colors.$scale?.[color]?.[colorShade],
        textAlign,
        ...style,
      },
    },
    children,
  );
};

const _Emphasis = forwardRef(Emphasis);
export { _Emphasis as Emphasis };
