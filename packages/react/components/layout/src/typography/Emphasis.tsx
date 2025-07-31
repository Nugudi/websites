import { vars } from "@nugudi/themes";
import clsx from "clsx";
import type { Ref } from "react";
import React, { forwardRef } from "react";
import { BaseStyle, StyleSprinkles } from "@/core/style.css";
import { emphasisStyle } from "@/typography/style.css";
import type { EmphasisProps } from "@/typography/types";
import { extractSprinkleProps } from "@/utils/properties";

const Emphasis = (props: EmphasisProps, ref: Ref<HTMLElement>) => {
  const { as = "em", fontSize, background, color = "main", children } = props;

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
        emphasisStyle({
          fontSize,
        }),
        props.className,
      ]),
      style: {
        color: color && vars.colors.$scale?.[color]?.[500],
        background: background && vars.colors.$scale?.[background]?.[500],
        ...props.style,
      },
    },
    children,
  );
};

const _Emphasis = forwardRef(Emphasis);
export { _Emphasis as Emphasis };
