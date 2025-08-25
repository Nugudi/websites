import type { PropsWithChildren } from "react";

export type BackdropProps = PropsWithChildren<{
  onClick?: () => void;
  className?: string;
}>;