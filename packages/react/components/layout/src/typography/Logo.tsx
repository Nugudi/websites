import { vars } from "@nugudi/themes";
import clsx from "clsx";
import type { Ref } from "react";
import React, { forwardRef } from "react";
import { BaseStyle, StyleSprinkles } from "@/core/style.css";
import { logoStyle } from "@/typography/style.css";
import type { LogoProps } from "@/typography/types";
import { extractSprinkleProps } from "@/utils/properties";

const Logo = (props: LogoProps, ref: Ref<HTMLElement>) => {
  const {
    as = "span",
    fontSize = "l1",
    color = "main",
    colorShade = 500,
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
        logoStyle({
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

const _Logo = forwardRef(Logo);
export { _Logo as Logo };
