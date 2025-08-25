import { clsx } from "clsx";
import type { Ref } from "react";
import { forwardRef } from "react";
import { backdropStyle } from "./style.css";
import type { BackdropProps } from "./types";

const Backdrop = (
  { children, className }: BackdropProps,
  ref: Ref<HTMLDivElement>,
) => {
  return (
    <div ref={ref} className={clsx(backdropStyle, className)}>
      {children}
    </div>
  );
};

const _Backdrop = forwardRef(Backdrop);
export { _Backdrop as Backdrop };
