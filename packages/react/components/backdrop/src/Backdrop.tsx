import { clsx } from "clsx";
import type { Ref } from "react";
import { forwardRef } from "react";
import { backdropStyle } from "./style.css";
import type { BackdropProps } from "./types";

const Backdrop = (
  { children, onClick, className }: BackdropProps,
  ref: Ref<HTMLDivElement>,
) => {
  if (onClick) {
    return (
      <div
        ref={ref}
        className={clsx(backdropStyle, className)}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === "Escape" || e.key === "Enter") {
            onClick();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Close backdrop"
      >
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} className={clsx(backdropStyle, className)}>
      {children}
    </div>
  );
};

const _Backdrop = forwardRef(Backdrop);
export { _Backdrop as Backdrop };
