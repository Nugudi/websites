import { classes, vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";

export const loadingContainer = style({
  width: "152px",
  height: "32px",
});

export const loadingText = style({
  padding: "0px 4px",
  textAlign: "center",
  color: vars.colors.$scale.zinc[400],
  ...classes.typography.title.t3,
  fontWeight: vars.typography.fontWeight[600],
});
