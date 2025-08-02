export type InputProps = {
  size?: "full";
  variant?: "default" | "filled";
  label?: string;
  isError?: boolean;
  errorMessage?: string;
  // useInput props
  isRequired?: boolean;
  isReadOnly?: boolean;
  isInvalid?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;
