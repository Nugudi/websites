import { vars } from "@nugudi/themes";
import clsx from "clsx";
import type { Ref } from "react";
import React, { forwardRef } from "react";
import { BaseStyle, StyleSprinkles } from "@/core/style.css";
import { bodyStyle } from "@/typography/style.css";
import type { BodyProps } from "@/typography/types";
import { extractSprinkleProps } from "@/utils/properties";

const Body = (props: BodyProps, ref: Ref<HTMLElement>) => {
  const {
    as = "span",
    fontSize = "b1",
    color = "zinc",
    colorShade = 600,
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
        bodyStyle({
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

const _Body = forwardRef(Body);
export { _Body as Body };
