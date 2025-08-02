export type InputProps = {
  size?: "full";
  variant?: "default" | "filled";
  label?: string;
  isError?: boolean;
  errorMessage?: string;
  // useInput props
  isDisabled?: boolean;
  isRequired?: boolean;
  isReadOnly?: boolean;
  isInvalid?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;
