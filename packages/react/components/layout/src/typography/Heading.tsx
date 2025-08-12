import { vars } from "@nugudi/themes";
import clsx from "clsx";
import type { Ref } from "react";
import React, { forwardRef } from "react";
import { BaseStyle, StyleSprinkles } from "@/core/style.css";
import { headingStyle } from "@/typography/style.css";
import type { HeadingProps } from "@/typography/types";
import { extractSprinkleProps } from "@/utils/properties";

const Heading = (props: HeadingProps, ref: Ref<HTMLElement>) => {
  const { as = "h1", fontSize, background, color = "main", children } = props;

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
        headingStyle({
          fontSize,
        }),
        props.className,
      ]),
      style: {
        color: color && vars.colors.$scale?.[color]?.[800],
        background: background && vars.colors.$scale?.[background]?.[500],
        ...props.style,
      },
    },
    children,
  );
};

const _Heading = forwardRef(Heading);
export { _Heading as Heading };
