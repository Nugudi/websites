import { classes, vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";

export const container = style({
  overflow: "hidden",
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  background: vars.colors.$static.light.color.white,
  width: "100%",
  boxSizing: "border-box",
  padding: "28px 16px",
  border: `1px solid ${vars.colors.$scale.zinc[100]}`,
});

export const textWrapper = style({
  textAlign: "start",
  ...classes.typography.title.t3,
  color: vars.colors.$scale.zinc[800],
  fontWeight: vars.typography.fontWeight[600],
});

export const name = style({
  color: vars.colors.$scale.main[500],
});

export const image = style({
  position: "absolute",
  right: "-4px",
  bottom: "-16px",
  width: "110px",
  objectFit: "contain",
});
