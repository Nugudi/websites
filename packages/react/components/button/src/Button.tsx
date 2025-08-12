import { vars } from "@nugudi/themes";
import { assignInlineVars } from "@vanilla-extract/dynamic";
import { clsx } from "clsx";
import * as React from "react";
import {
  activeColorVariant,
  buttonStyle,
  enableColorVariant,
  hoverColorVariant,
  spanStyle,
  spinnerStyle,
} from "./style.css";
import type { ButtonProps } from "./types";

const Button = (props: ButtonProps, ref: React.Ref<HTMLButtonElement>) => {
  const {
    variant = "brand",
    size = "lg",
    color = "whiteAlpha",
    leftIcon,
    rightIcon,
    isLoading,
    children,
    style,
    type = "button",
    ...restProps
  } = props;

  const enableColor = vars.colors.$scale[color][500];
  const hoverColor =
    variant === "brand"
      ? vars.colors.$scale[color][600]
      : vars.colors.$scale[color][500];
  const activeColor =
    variant === "brand"
      ? vars.colors.$scale[color][600]
      : vars.colors.$scale[color][500];

  return (
    <button
      {...restProps}
      type={type}
      ref={ref}
      disabled={restProps.disabled || isLoading}
      data-loading={isLoading ? "true" : undefined}
      className={clsx([
        buttonStyle({
          size,
          variant,
        }),
        restProps.className,
      ])}
      style={{
        ...assignInlineVars({
          [enableColorVariant]: enableColor,
          [hoverColorVariant]: hoverColor,
          [activeColorVariant]: activeColor,
        }),
        ...style,
      }}
    >
      {isLoading && <div className={spinnerStyle({ size })} />}
      {leftIcon && <span className={spanStyle({ size })}>{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className={spanStyle({ size })}>{rightIcon}</span>}
    </button>
  );
};

const _Button = React.forwardRef(Button);
export { _Button as Button };
