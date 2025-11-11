import { vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";

export const container = style({
  width: "100%",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  boxSizing: "border-box",
  padding: "16px",
  background: vars.colors.$static.light.gradient.linearGreen,
});
