import { clsx } from "clsx";
import * as React from "react";
import {
  containerStyle,
  errorMessageStyle,
  inputContainerStyle,
  otpInputStyle,
} from "./style.css";
import type { InputOTPProps } from "./types";
import { useInputOTP } from "./useInputOTP";

const InputOTP = (props: InputOTPProps, ref: React.Ref<HTMLDivElement>) => {
  const {
    length = 6,
    value,
    defaultValue,
    onChange,
    onBlur,
    onFocus,
    disabled = false,
    className,
    inputClassName,
    isError = false,
    invalid,
    errorMessage,
    inputMode = "numeric",
    pattern = "[0-9]*",
    id,
    name,
    "aria-describedby": ariaDescribedBy,
    ...rest
  } = props;

  const {
    value: currentValue,
    // biome-ignore lint/correctness/noUnusedVariables: <ef={(el) => inputRefs.current[index] = el>
    inputRefs,
    handleInputChange,
    handleKeyDown,
    handleFocus,
    handlePaste,
    containerProps,
  } = useInputOTP({
    length,
    pattern,
    invalid: invalid || isError,
    errorMessage,
    value: value || defaultValue,
    onChange,
    onBlur,
    onFocus,
    disabled,
    id,
    "aria-describedby": ariaDescribedBy,
  });

  return (
    <div
      ref={ref}
      className={clsx(containerStyle, className)}
      {...containerProps}
      {...rest}
    >
      <div className={inputContainerStyle}>
        {Array.from({ length }, (_, index) => (
          <input
            // biome-ignore lint/suspicious/noArrayIndexKey: <onChange={(e) => handleInputChange(index, e.target.value)}>
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode={inputMode}
            pattern={pattern}
            maxLength={1}
            name={name ? `${name}-${index}` : undefined}
            value={currentValue[index] || ""}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onFocus={() => handleFocus(index)}
            onPaste={index === 0 ? handlePaste : undefined}
            disabled={disabled}
            className={clsx(
              otpInputStyle({
                isError: isError || invalid,
                isFilled: !!currentValue[index],
              }),
              inputClassName,
            )}
          />
        ))}
      </div>
      {(isError || invalid) && errorMessage && (
        <div
          id={containerProps["aria-describedby"]
            ?.split(" ")
            .find((id) => id.includes("error"))}
          className={errorMessageStyle}
        >
          {errorMessage}
        </div>
      )}
    </div>
  );
};

const _InputOTP = React.forwardRef(InputOTP);
export { _InputOTP as InputOTP };
