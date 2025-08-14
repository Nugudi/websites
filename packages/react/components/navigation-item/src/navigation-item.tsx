import { Slot } from "@radix-ui/react-slot";
import { clsx } from "clsx";
import * as React from "react";
import {
  labelStyle,
  leftIconStyle,
  navigationItemStyle,
  rightIconStyle,
} from "./style.css";
import type { NavigationItemProps } from "./types";

const NavigationItem = React.forwardRef<HTMLButtonElement, NavigationItemProps>(
  (
    {
      children,
      leftIcon,
      rightIcon,
      disabled = false,
      size = "md",
      onClick,
      className,
      asChild = false,
      ...restProps
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    const handleClick = () => {
      if (!disabled && onClick) {
        onClick();
      }
    };

    return (
      <Comp
        {...restProps}
        ref={ref}
        {...(!asChild && { type: "button" })}
        disabled={disabled}
        onClick={handleClick}
        className={clsx([
          navigationItemStyle({
            size,
            disabled,
          }),
          className,
        ])}
      >
        {leftIcon && (
          <span className={leftIconStyle({ size })} aria-hidden="true">
            {leftIcon}
          </span>
        )}
        <div className={labelStyle}>{children}</div>
        {rightIcon && (
          <span className={rightIconStyle({ size })} aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </Comp>
    );
  },
);

NavigationItem.displayName = "NavigationItem";

export { NavigationItem };
