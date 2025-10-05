import { classes, vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";

export const textSection = style({
  width: "100%",
  zIndex: 1,
});

export const title = style({
  ...classes.typography.heading.h1,
  color: vars.colors.$scale.zinc[900],
  fontWeight: vars.typography.fontWeight[600],
});

export const logoTextIcon = style({
  width: "100px",
  height: "auto",
  marginBottom: "8px",
});
