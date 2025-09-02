import type { vars } from "@nugudi/themes";
import type { JSX } from "react";

type AsProps = {
  as?: Exclude<keyof JSX.IntrinsicElements, keyof SVGElementTagNameMap>;
};

type ElementProps = Omit<React.HTMLAttributes<HTMLElement>, "as">;

export type AsElementProps = AsProps & ElementProps;

export type ColorProps = {
  color?: keyof typeof vars.colors.$scale;
  background?: keyof typeof vars.colors.$scale;
};

/**
 * Special size keywords that are converted to CSS values
 */
export type SizeKeyword = "full" | "screen" | "min" | "max" | "fit" | "auto";

/**
 * Width/Height value type with proper inference
 * Combines CSSProperties types with our custom keywords
 * Using template literal pattern for better autocomplete
 */
export type SizeValue =
  | SizeKeyword
  | "min-content"
  | "max-content"
  | "fit-content"
  | `${number}px`
  | `${number}%`
  | `${number}rem`
  | `${number}em`
  | `${number}vh`
  | `${number}vw`
  | `${number}vmin`
  | `${number}vmax`
  | (string & {}) // Allows any string but prioritizes specific values in autocomplete
  | number;

/**
 * Spacing value type - accepts numbers (pixels) or CSS margin/padding values
 * Using template literal pattern for better autocomplete
 */
export type SpacingValue =
  | "auto"
  | `${number}px`
  | `${number}%`
  | `${number}rem`
  | `${number}em`
  | `${number}vh`
  | `${number}vw`
  | (string & {}) // Allows any string but prioritizes specific values in autocomplete
  | number;

/**
 * Spacing properties that accept flexible values
 */
export type SpacingProps = {
  // Margin properties
  m?: SpacingValue;
  margin?: SpacingValue;
  marginTop?: SpacingValue;
  marginRight?: SpacingValue;
  marginBottom?: SpacingValue;
  marginLeft?: SpacingValue;
  mt?: SpacingValue;
  mr?: SpacingValue;
  mb?: SpacingValue;
  ml?: SpacingValue;
  mX?: SpacingValue;
  mY?: SpacingValue;

  // Padding properties
  p?: SpacingValue;
  padding?: SpacingValue;
  paddingTop?: SpacingValue;
  paddingRight?: SpacingValue;
  paddingBottom?: SpacingValue;
  paddingLeft?: SpacingValue;
  pt?: SpacingValue;
  pr?: SpacingValue;
  pb?: SpacingValue;
  pl?: SpacingValue;
  pX?: SpacingValue;
  pY?: SpacingValue;
};

/**
 * Size properties that accept flexible values
 */
export type SizeProps = {
  // Width properties
  width?: SizeValue;
  w?: SizeValue;
  maxWidth?: SizeValue;
  maxW?: SizeValue;
  minWidth?: SizeValue;
  minW?: SizeValue;

  // Height properties
  height?: SizeValue;
  h?: SizeValue;
  maxHeight?: SizeValue;
  maxH?: SizeValue;
  minHeight?: SizeValue;
  minH?: SizeValue;

  // Combined size properties
  size?: SizeValue;
  maxSize?: SizeValue;
  minSize?: SizeValue;
  sizeX?: SizeValue;
  sizeY?: SizeValue;
};

/**
 * Theme token types for proper inference
 */
export type BorderRadiusValue = keyof typeof vars.box.radii;
export type BoxShadowValue = keyof typeof vars.box.shadows;

/**
 * Other style properties with enhanced type inference
 */
export type OtherStyleProps = {
  borderRadius?:
    | BorderRadiusValue
    | `${number}px`
    | `${number}%`
    | `${number}rem`
    | (string & {})
    | number;
  boxShadow?: BoxShadowValue | "none" | (string & {});
};

export type StyleProps = SpacingProps &
  SizeProps &
  OtherStyleProps &
  ColorProps;
