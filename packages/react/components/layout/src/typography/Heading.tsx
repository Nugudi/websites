import { vars } from "@nugudi/themes";
import clsx from "clsx";
import type { Ref } from "react";
import React, { forwardRef } from "react";
import { BaseStyle, StyleSprinkles } from "@/core/style.css";
import { headingStyle } from "@/typography/style.css";
import type { HeadingProps } from "@/typography/types";
import { extractSprinkleProps } from "@/utils/properties";

const Heading = (props: HeadingProps, ref: Ref<HTMLElement>) => {
  const {
    as = "h1",
    fontSize = "h1",
    color = "zinc",
    colorShade = 800,
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
        headingStyle({
          fontSize,
        }),
        className,
      ]),
      style: {
        color: color && vars.colors.$scale?.[color]?.[colorShade],
        ...style,
      },
    },
    children,
  );
};

const _Heading = forwardRef(Heading);
export { _Heading as Heading };
