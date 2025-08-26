import { vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";

export const backdropStyle = style({
  position: "fixed",
  inset: 0,
  backgroundColor: vars.colors.$static.light.color.backdrop,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
  transition: "opacity 0.3s ease",
});
