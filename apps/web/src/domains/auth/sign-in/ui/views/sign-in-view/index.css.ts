import { vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";

export const container = style({
  width: "100%",
  minHeight: "100vh",
  height: "100%",
  position: "relative",
  overflow: "hidden",
  boxSizing: "border-box",
  background: vars.colors.$static.light.gradient.linearGreen,
});

export const logo = style({
  position: "absolute",
  right: "-100px",
  top: "38%",
  transform: "translateY(-50%)",
});

export const logoImage = style({
  width: "100%",
  height: "100%",
  objectFit: "contain",
});
