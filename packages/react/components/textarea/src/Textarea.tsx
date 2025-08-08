import { clsx } from "clsx";
import * as React from "react";
import {
  characterCountStyle,
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
    maxLength,
    value,
    disabled,
    ...textareaBaseProps
  } = props;

  const [internalValue, setInternalValue] = React.useState("");

  const { textareaProps, isFocused } = useTextarea({
    ...textareaBaseProps,
    maxLength,
    value,
    disabled,
    invalid: invalid || isError,
    errorMessage,
    onChange: (e) => {
      // uncontrolled일 때만 내부 state 업데이트
      if (value === undefined) {
        setInternalValue(e.target.value);
      }
      // 원래 onChange 호출
      textareaBaseProps.onChange?.(e);
    },
  });

  // controlled면 props.value, uncontrolled면 내부 state 사용
  const currentValue = value !== undefined ? value : internalValue;
  const currentLength = String(currentValue).length;

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
          style={{
            paddingBottom: maxLength && maxLength > 0 ? "3.2rem" : undefined,
          }}
        />
        {maxLength && maxLength > 0 && !disabled && (
          <span className={characterCountStyle()}>
            <span>{currentLength}</span> / {maxLength}
          </span>
        )}
      </div>
      {isError && errorMessage && (
        <div className={errorMessageStyle()}>{errorMessage}</div>
      )}
    </div>
  );
};

const _Textarea = React.forwardRef(Textarea);
export { _Textarea as Textarea };
