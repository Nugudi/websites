import type { vars } from "@nugudi/themes";
import type { JSX } from "react";
import type { StyleSprinkles } from "./style.css";

type AsProps = {
  as?: Exclude<keyof JSX.IntrinsicElements, keyof SVGElementTagNameMap>;
};

type ElementProps = Omit<React.HTMLAttributes<HTMLElement>, "as">;

export type AsElementProps = AsProps & ElementProps;

export type ColorProps = {
  color?: keyof typeof vars.colors.$scale;
  background?: keyof typeof vars.colors.$scale;
};

export type StyleProps = Parameters<typeof StyleSprinkles>[0] & ColorProps;
