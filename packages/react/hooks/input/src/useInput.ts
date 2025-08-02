import type { FocusEvent, InputHTMLAttributes } from "react";
import { useCallback, useState } from "react";

export interface UseInputProps extends InputHTMLAttributes<HTMLInputElement> {
  isDisabled?: boolean;
  isRequired?: boolean;
  isReadOnly?: boolean;
  isInvalid?: boolean;
  errorMessage?: string;
}

export interface UseInputReturn {
  inputProps: InputHTMLAttributes<HTMLInputElement> & {
    "aria-invalid"?: boolean;
    "aria-describedby"?: string;
    "aria-required"?: boolean;
  };
  isFocused: boolean;
}

export const useInput = (props: UseInputProps): UseInputReturn => {
  const {
    isDisabled,
    isRequired,
    isReadOnly,
    isInvalid,
    errorMessage,
    id,
    onFocus,
    onBlur,
    "aria-describedby": ariaDescribedBy,
    ...rest
  } = props;

  const [isFocused, setIsFocused] = useState(false);

  const errorId = errorMessage && id ? `${id}-error` : undefined;

  const handleFocus = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    },
    [onFocus],
  );

  const handleBlur = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    },
    [onBlur],
  );

  const inputProps: UseInputReturn["inputProps"] = {
    ...rest,
    id,
    disabled: isDisabled,
    readOnly: isReadOnly,
    required: isRequired,
    onFocus: handleFocus,
    onBlur: handleBlur,
    "aria-invalid": isInvalid,
    "aria-required": isRequired,
    "aria-describedby":
      [ariaDescribedBy, errorId].filter(Boolean).join(" ") || undefined,
  };

  return {
    inputProps,
    isFocused,
  };
};
