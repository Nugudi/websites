import type { classes } from "@nugudi/themes";
import type { AsElementProps, StyleProps } from "@/core/types";

export type HeadingProps = StyleProps &
  AsElementProps & {
    fontSize: keyof typeof classes.typography.heading;
  };

export type EmphasisProps = StyleProps &
  AsElementProps & {
    fontSize: keyof typeof classes.typography.emphasis;
  };

export type TitleProps = StyleProps &
  AsElementProps & {
    fontSize: keyof typeof classes.typography.title;
  };

export type BodyProps = StyleProps &
  AsElementProps & {
    fontSize: keyof typeof classes.typography.body;
  };

export type LogoProps = StyleProps &
  AsElementProps & {
    fontSize: keyof typeof classes.typography.logo;
  };
