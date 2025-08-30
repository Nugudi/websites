import { vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";

export const container = style({
  width: "100%",
  boxSizing: "border-box",
  backgroundColor: vars.colors.$static.light.color.white,
  border: `1px solid ${vars.colors.$scale.zinc[50]}`,
});

export const link = style({
  textDecoration: "none",
});
