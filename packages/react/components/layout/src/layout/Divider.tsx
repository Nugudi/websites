import { vars } from "@nugudi/themes";
import React from "react";
import type { DividerProps } from "./types";

const Divider = (props: DividerProps, ref: React.Ref<HTMLHRElement>) => {
  const {
    color = "blackAlpha",
    variant = "solid",
    size = 1,
    orientation = "horizontal",
  } = props;

  const borderStyle =
    orientation === "horizontal"
      ? {
          width: "100%",
          borderWidth: `0 0 ${size}px 0`,
        }
      : {
          height: "100%",
          borderWidth: `0 0 0 ${size}px`,
        };

  return (
    <hr
      {...props}
      ref={ref}
      style={{
        margin: 0,
        borderStyle: variant,
        borderColor: color && vars.colors.$scale?.[color]?.[200],
        backgroundColor: "transparent",
        ...borderStyle,
        ...props.style,
      }}
    />
  );
};

const _Divider = React.forwardRef(Divider);
export { _Divider as Divider };
