import { clsx } from "clsx";
import * as React from "react";
import {
  containerStyle,
  errorMessageStyle,
  inputStyle,
  labelStyle,
} from "./style.css";
import type { InputProps } from "./types";
import { useInput } from "./useInput";

const Input = (props: InputProps, ref: React.Ref<HTMLInputElement>) => {
  const {
    variant = "default",
    size = "full",
    label,
    isError,
    errorMessage,
    className,
    style,
    invalid,
    ...inputBaseProps
  } = props;

  const { inputProps, isFocused } = useInput({
    ...inputBaseProps,
    invalid: invalid || isError,
    errorMessage,
  });

  return (
    <div className={clsx([containerStyle()])} style={{ ...style }}>
      {label && (
        <label
          className={labelStyle({ isError, isFocused: isFocused && !isError })}
          htmlFor={inputProps.id}
        >
          {label}
        </label>
      )}
      <div style={{ position: "relative", width: "100%" }}>
        <input
          {...inputProps}
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
