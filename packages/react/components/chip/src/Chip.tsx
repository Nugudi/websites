import { clsx } from "clsx";
import * as React from "react";
import { chipStyle, iconStyle } from "./style.css";
import type { ChipProps } from "./types";

const Chip = (props: ChipProps, ref: React.Ref<HTMLButtonElement>) => {
  const {
    label,
    size = "md",
    variant = "default",
    icon,
    className,
    ...rest
  } = props;

  return (
    <button
      {...rest}
      ref={ref}
      type="button"
      className={clsx([
        chipStyle({
          size,
          variant,
        }),
        className,
      ])}
    >
      {icon && <span className={iconStyle({ size })}>{icon}</span>}
      <span>{label}</span>
    </button>
  );
};

const _Chip = React.forwardRef(Chip);
export { _Chip as Chip };
