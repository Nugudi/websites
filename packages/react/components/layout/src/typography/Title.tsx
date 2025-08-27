import { vars } from "@nugudi/themes";
import clsx from "clsx";
import type { Ref } from "react";
import React, { forwardRef } from "react";
import { BaseStyle, StyleSprinkles } from "@/core/style.css";
import { titleStyle } from "@/typography/style.css";
import type { TitleProps } from "@/typography/types";
import { extractSprinkleProps } from "@/utils/properties";

const Title = (props: TitleProps, ref: Ref<HTMLElement>) => {
  const {
    as = "h2",
    fontSize = "t1",
    color = "zinc",
    colorShade = 700,
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
        titleStyle({
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

const _Title = forwardRef(Title);
export { _Title as Title };
