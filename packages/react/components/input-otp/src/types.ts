import type {
  ClipboardEvent,
  FocusEvent,
  KeyboardEvent,
  MutableRefObject,
} from "react";

export interface UseInputOTPProps {
  length?: number;
  pattern?: string;
  isError?: boolean;
  errorMessage?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: (e: FocusEvent<HTMLDivElement>) => void;
  onFocus?: (e: FocusEvent<HTMLDivElement>) => void;
  disabled?: boolean;
  id?: string;
  name?: string;
  "aria-describedby"?: string;
}

export interface UseInputOTPReturn {
  value: string;
  inputRefs: MutableRefObject<(HTMLInputElement | null)[]>;
  handleInputChange: (index: number, inputValue: string) => void;
  handleKeyDown: (index: number, e: KeyboardEvent<HTMLInputElement>) => void;
  handleFocus: (index: number) => void;
  handlePaste: (e: ClipboardEvent<HTMLInputElement>) => void;
  containerProps: {
    id?: string;
    "aria-invalid"?: boolean;
    "aria-describedby"?: string;
    onBlur?: (e: FocusEvent<HTMLDivElement>) => void;
    onFocus?: (e: FocusEvent<HTMLDivElement>) => void;
  };
}

export interface InputOTPProps {
  length?: number;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onBlur?: (e: FocusEvent<HTMLDivElement>) => void;
  onFocus?: (e: FocusEvent<HTMLDivElement>) => void;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  isError?: boolean;
  errorMessage?: string;
  inputMode?: "text" | "numeric";
  pattern?: string;
  id?: string;
  name?: string;
  "aria-describedby"?: string;
}
