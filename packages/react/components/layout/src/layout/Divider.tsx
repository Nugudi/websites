import { vars } from "@nugudi/themes";
import React from "react";
import { toCSSValue } from "../utils/style-helpers";
import type { DividerProps } from "./types";

const Divider = (props: DividerProps, ref: React.Ref<HTMLHRElement>) => {
  const {
    color = "blackAlpha",
    variant = "solid",
    size = 1,
    orientation = "horizontal",
    style,
    ...restProps
  } = props;

  // Process size value
  const processedSize =
    typeof size === "number" ? `${size}px` : toCSSValue(size);

  const borderStyle =
    orientation === "horizontal"
      ? {
          width: "100%",
          borderWidth: `0 0 ${processedSize} 0`,
        }
      : {
          height: "100%",
          borderWidth: `0 0 0 ${processedSize}`,
        };

  return (
    <hr
      {...restProps}
      ref={ref}
      style={{
        margin: 0,
        borderStyle: variant,
        borderColor: color && vars.colors.$scale?.[color]?.[200],
        backgroundColor: "transparent",
        ...borderStyle,
        ...style,
      }}
    />
  );
};

const _Divider = React.forwardRef(Divider);
export { _Divider as Divider };
