export type InputProps = {
  size?: "full";
  variant?: "default" | "filled";
  label?: string;
  isError?: boolean;
  errorMessage?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;
