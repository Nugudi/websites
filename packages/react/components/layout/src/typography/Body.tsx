import { vars } from "@nugudi/themes";
import clsx from "clsx";
import type { Ref } from "react";
import React, { forwardRef } from "react";
import { BaseStyle, StyleSprinkles } from "@/core/style.css";
import { bodyStyle } from "@/typography/style.css";
import type { BodyProps } from "@/typography/types";
import { extractSprinkleProps } from "@/utils/properties";

const Body = (props: BodyProps, ref: Ref<HTMLElement>) => {
  const { as = "p", fontSize, background, color = "main", children } = props;

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
        bodyStyle({
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

const _Body = forwardRef(Body);
export { _Body as Body };
