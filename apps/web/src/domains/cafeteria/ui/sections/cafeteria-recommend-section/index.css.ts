import { classes, vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";

export const titleContainer = style({
  marginLeft: "4px",
});

export const title = style({
  ...classes.typography.body.b1,
  color: vars.colors.$scale.zinc[700],
  fontWeight: vars.typography.fontWeight[600],
});

export const description = style({
  ...classes.typography.emphasis.e1,
  color: vars.colors.$scale.zinc[400],
});
