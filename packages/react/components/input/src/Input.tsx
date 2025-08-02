import { clsx } from "clsx";
import * as React from "react";
import {
  containerStyle,
  errorMessageStyle,
  inputStyle,
  labelStyle,
} from "./style.css";
import type { InputProps } from "./types";

const Input = (props: InputProps, ref: React.Ref<HTMLInputElement>) => {
  const {
    variant = "default",
    size = "full",
    label,
    isError,
    errorMessage,
    className,
    style,
    onFocus,
    onBlur,
    ...rest
  } = props;

  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <div className={clsx([containerStyle()])} style={{ ...style }}>
      {label && (
        <label
          className={labelStyle({ isError, isFocused: isFocused && !isError })}
          htmlFor={rest.id}
        >
          {label}
        </label>
      )}
      <div style={{ position: "relative", width: "100%" }}>
        <input
          {...rest}
          ref={ref}
          className={clsx(
            [
              inputStyle({
                size,
                variant,
                isError,
              }),
            ],
            className,
          )}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
        />
      </div>
      {isError && errorMessage && (
        <div className={errorMessageStyle()}>{errorMessage}</div>
      )}
    </div>
  );
};

const _Input = React.forwardRef(Input);
export { _Input as Input };
