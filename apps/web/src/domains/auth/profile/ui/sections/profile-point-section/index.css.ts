import { classes, vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";

export const container = style({
  width: "100%",
  boxSizing: "border-box",
  backgroundColor: vars.colors.$static.light.color.white,
  border: `1px solid ${vars.colors.$scale.zinc[50]}`,
  padding: "8px",
});

export const link = style({
  textDecoration: "none",
});

export const contentWrapper = style({
  gap: "2px",
  flexDirection: "column",
  justifyContent: "center",
});

export const labelText = style({
  ...classes.typography.emphasis.e1,
  color: vars.colors.$scale.zinc[400],
});

export const pointText = style({
  ...classes.typography.title.t3,
  fontWeight: vars.typography.fontWeight[600],
  color: vars.colors.$scale.zinc[600],
});
