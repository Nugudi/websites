import type * as React from "react";
import type { InputHTMLAttributes } from "react";

export interface UseInputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean; // aria-invalid용
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

export type InputProps = {
  size?: "full";
  variant?: "default" | "filled";
  label?: string;
  isError?: boolean;
  errorMessage?: string;
  invalid?: boolean; // aria-invalid용
  rightIcon?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>;
