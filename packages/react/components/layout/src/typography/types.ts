import type { ColorShade, classes, vars } from "@nugudi/themes";
import type { AsElementProps, StyleProps } from "@/core/types";

type ColorScale = keyof typeof vars.colors.$scale;

export type ColorWithShade = {
  color?: ColorScale;
  colorShade?: ColorShade;
};

export type HeadingProps = Omit<StyleProps, "color" | "background"> &
  AsElementProps &
  ColorWithShade & {
    fontSize: keyof typeof classes.typography.heading;
  };

export type EmphasisProps = Omit<StyleProps, "color" | "background"> &
  AsElementProps &
  ColorWithShade & {
    fontSize: keyof typeof classes.typography.emphasis;
  };

export type TitleProps = Omit<StyleProps, "color" | "background"> &
  AsElementProps &
  ColorWithShade & {
    fontSize: keyof typeof classes.typography.title;
  };

export type BodyProps = Omit<StyleProps, "color" | "background"> &
  AsElementProps &
  ColorWithShade & {
    fontSize: keyof typeof classes.typography.body;
  };

export type LogoProps = Omit<StyleProps, "color" | "background"> &
  AsElementProps &
  ColorWithShade & {
    fontSize: keyof typeof classes.typography.logo;
  };
