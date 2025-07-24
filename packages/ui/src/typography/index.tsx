import { clsx } from "clsx";
import type { ElementType, ReactNode } from "react";
import {
  typographyBase,
  typographyColors,
  typographySizes,
} from "./typography.css";

export type TypographySize =
  | "h1"
  | "t1"
  | "t2"
  | "t3"
  | "b1"
  | "b2"
  | "b3"
  | "b3b"
  | "b4"
  | "b4b"
  | "e1"
  | "e2"
  | "l1"
  | "l2";

export type TypographyColor =
  | "main-500"
  | "main-800"
  | "zinc-50"
  | "zinc-100"
  | "zinc-200"
  | "zinc-300"
  | "zinc-400"
  | "zinc-500"
  | "zinc-600"
  | "zinc-700"
  | "zinc-800"
  | "error"
  | "white"
  | "black";

type TypographyProps<T extends ElementType = "p"> = {
  as?: T;
  children?: ReactNode;
  className?: string;
  size: TypographySize;
  color?: TypographyColor;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "children">;

export const Typography = <T extends ElementType = "p">({
  as,
  children,
  className,
  size,
  color = "black",
  ...rest
}: TypographyProps<T>) => {
  const Component = (as || "p") as ElementType;

  return (
    <Component
      className={clsx(
        typographyBase,
        typographySizes[size],
        typographyColors[color],
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  );
};
