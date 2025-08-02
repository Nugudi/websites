import type { InputHTMLAttributes } from "react";

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
