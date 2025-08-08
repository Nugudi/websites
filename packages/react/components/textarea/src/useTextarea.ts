import type { FocusEvent } from "react";
import { useCallback, useState } from "react";
import type { UseTextareaProps, UseTextareaReturn } from "./types";

export const useTextarea = (props: UseTextareaProps): UseTextareaReturn => {
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
    (e: FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    },
    [onFocus],
  );

  const handleBlur = useCallback(
    (e: FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    },
    [onBlur],
  );

  const textareaProps: UseTextareaReturn["textareaProps"] = {
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
    textareaProps,
    isFocused,
  };
};
