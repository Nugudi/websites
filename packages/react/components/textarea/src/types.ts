import type * as React from "react";
import type { TextareaHTMLAttributes } from "react";

export interface UseTextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean; // aria-invalid용
  errorMessage?: string;
}

export interface UseTextareaReturn {
  textareaProps: TextareaHTMLAttributes<HTMLTextAreaElement> & {
    "aria-invalid"?: boolean;
    "aria-describedby"?: string;
    "aria-required"?: boolean;
  };
  isFocused: boolean;
}

export type TextareaProps = {
  size?: "full";
  label?: string;
  isError?: boolean;
  errorMessage?: string;
  invalid?: boolean;
  resize?: "none" | "vertical" | "horizontal" | "both";
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;
