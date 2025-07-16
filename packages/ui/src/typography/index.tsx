import type { CSSProperties, ElementType, ReactNode } from "react";
import { cn } from "../utils";

export type TypographyVariant =
  | "H1"
  | "T1"
  | "T2"
  | "T3"
  | "B1"
  | "B2"
  | "B3"
  | "B3-BOLD"
  | "B4"
  | "B4-BOLD"
  | "E1"
  | "E2";

const variantConfig: Record<
  TypographyVariant,
  {
    cssVarPrefix: string;
    defaultTag: ElementType;
  }
> = {
  H1: { cssVarPrefix: "text-h1-semi30", defaultTag: "h1" },
  T1: { cssVarPrefix: "text-title1-semi28", defaultTag: "h2" },
  T2: { cssVarPrefix: "text-title2-medi22", defaultTag: "h3" },
  T3: { cssVarPrefix: "text-title3-bold20", defaultTag: "h4" },
  B1: { cssVarPrefix: "text-body1-regular17", defaultTag: "p" },
  B2: { cssVarPrefix: "text-body2-regular16", defaultTag: "p" },
  B3: { cssVarPrefix: "text-subheadline-regular15", defaultTag: "p" },
  "B3-BOLD": { cssVarPrefix: "text-subheadline-semi15", defaultTag: "p" },
  B4: { cssVarPrefix: "text-footnote-regular13", defaultTag: "p" },
  "B4-BOLD": { cssVarPrefix: "text-footnote-semi13", defaultTag: "p" },
  E1: { cssVarPrefix: "text-caption1-regular12", defaultTag: "span" },
  E2: { cssVarPrefix: "text-caption2-regular11", defaultTag: "span" },
};

type PolymorphicRef<T extends ElementType> =
  React.ComponentPropsWithRef<T>["ref"];

type PolymorphicComponentProp<T extends ElementType, Props = {}> = {
  as?: T;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
} & Props &
  Omit<React.ComponentPropsWithoutRef<T>, keyof Props | "as" | "children">;

type PolymorphicComponentPropWithRef<
  T extends ElementType,
  Props = {},
> = PolymorphicComponentProp<T, Props> & {
  ref?: PolymorphicRef<T>;
};

export type TypographyProps<T extends ElementType = "p"> =
  PolymorphicComponentPropWithRef<
    T,
    {
      variant: TypographyVariant;
    }
  >;

export const Typography = <T extends ElementType = "p">({
  variant,
  as,
  children,
  className,
  style,
  ...rest
}: TypographyProps<T>) => {
  const config = variantConfig[variant];
  const Component = (as || config.defaultTag) as ElementType;

  const typographyStyle: CSSProperties = {
    fontSize: `var(--${config.cssVarPrefix})`,
    fontWeight: `var(--${config.cssVarPrefix}--font-weight)`,
    lineHeight: `var(--${config.cssVarPrefix}--line-height)`,
    letterSpacing: `var(--${config.cssVarPrefix}--letter-spacing)`,
    fontFamily: `var(--font-sans)`,
    ...style,
  };

  return (
    <Component className={cn(className)} style={typographyStyle} {...rest}>
      {children}
    </Component>
  );
};
