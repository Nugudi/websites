import type { FocusEvent } from "react";
import { useCallback, useState } from "react";
import type { UseInputProps, UseInputReturn } from "./types";

export const useInput = (props: UseInputProps): UseInputReturn => {
  const {
    invalid,
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
    onFocus: handleFocus,
    onBlur: handleBlur,
    "aria-invalid": invalid,
    "aria-required": rest.required,
    "aria-describedby":
      [ariaDescribedBy, errorId].filter(Boolean).join(" ") || undefined,
  };

  return {
    inputProps,
    isFocused,
  };
};
