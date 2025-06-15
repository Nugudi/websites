import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

export type NugudiButtonProps = PropsWithChildren<
  {
    className?: string;
  } & ButtonHTMLAttributes<HTMLButtonElement>
>;

export const NugudiButton = ({
  children,
  className,
  ...props
}: NugudiButtonProps) => {
  return (
    <button className={className} {...props}>
      <h1 className={"text-2xl text-red-500"}>{children}</h1>
    </button>
  );
};
