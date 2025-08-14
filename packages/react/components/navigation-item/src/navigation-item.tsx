import { clsx } from "clsx";
import * as React from "react";
import {
  labelStyle,
  leftIconStyle,
  navigationItemStyle,
  rightIconStyle,
} from "./style.css";
import type { NavigationItemProps } from "./types";

const NavigationItem = React.forwardRef<HTMLDivElement, NavigationItemProps>(
  (
    {
      children,
      leftIcon,
      rightIcon,
      disabled = false,
      size = "md",
      className,
      ...restProps
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        {...restProps}
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
        <span className={labelStyle}>{children}</span>
        {rightIcon && (
          <span className={rightIconStyle({ size })} aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </div>
    );
  },
);

NavigationItem.displayName = "NavigationItem";

export { NavigationItem };
