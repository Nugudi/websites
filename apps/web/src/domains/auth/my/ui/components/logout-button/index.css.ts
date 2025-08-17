import { classes, vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";

export const buttonBox = style({
  marginTop: "1rem",
  textDecoration: "underline",
  ...classes.typography.emphasis.e1,
  color: vars.colors.$scale.zinc[300],
  ":hover": {
    color: `${vars.colors.$scale.zinc[400]} !important`,
  },
});
