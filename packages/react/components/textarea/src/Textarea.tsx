import { clsx } from "clsx";
import * as React from "react";
import {
  containerStyle,
  errorMessageStyle,
  labelStyle,
  textareaStyle,
} from "./style.css";
import type { TextareaProps } from "./types";
import { useTextarea } from "./useTextarea";

const Textarea = (
  props: TextareaProps,
  ref: React.Ref<HTMLTextAreaElement>,
) => {
  const {
    size = "full",
    label,
    isError,
    errorMessage,
    className,
    style,
    invalid,
    resize = "vertical",
    ...textareaBaseProps
  } = props;

  const { textareaProps, isFocused } = useTextarea({
    ...textareaBaseProps,
    invalid: invalid || isError,
    errorMessage,
  });

  return (
    <div className={clsx([containerStyle()])} style={{ ...style }}>
      {label && (
        <label
          className={labelStyle({ isError, isFocused: isFocused && !isError })}
          htmlFor={textareaProps.id}
        >
          {label}
        </label>
      )}
      <div style={{ position: "relative", width: "100%" }}>
        <textarea
          {...textareaProps}
          ref={ref}
          className={clsx(
            [
              textareaStyle({
                size,
                isError,
                resize,
              }),
            ],
            className,
          )}
        />
      </div>
      {isError && errorMessage && (
        <div className={errorMessageStyle()}>{errorMessage}</div>
      )}
    </div>
  );
};

const _Textarea = React.forwardRef(Textarea);
export { _Textarea as Textarea };
