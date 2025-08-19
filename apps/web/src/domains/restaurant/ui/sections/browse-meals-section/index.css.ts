import { classes, vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";

export const button = style({
  color: vars.colors.$scale.zinc[800],
  ...classes.typography.title.t3,
  fontWeight: vars.typography.fontWeight[600],
  padding: "0px 4px",

  ":hover": {
    color: vars.colors.$scale.main[600],
  },
});

export const buttonActive = style([
  button,
  {
    color: vars.colors.$scale.main[600],
  },
]);
