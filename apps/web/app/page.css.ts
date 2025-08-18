import { vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";

export const container = style({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  background: vars.colors.$static.light.gradient.linearGreen,
  minHeight: "calc(100dvh - 67px)",
  height: "100%",
  width: "100%",
  padding: "16px",
});
