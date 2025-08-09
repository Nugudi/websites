import { classes, vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";

export const container = style({
  width: "100%",
  position: "relative",
  overflow: "hidden",
  minHeight: "100vh",
});

export const textSection = style({
  width: "100%",
  zIndex: 1,
  paddingLeft: "2rem",
  marginTop: "10%",
});

export const title = style({
  ...classes.typography.heading.h1,
  color: vars.colors.$scale.zinc[900],
  fontWeight: vars.typography.fontWeight[600],
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

export const logoTextIcon = style({
  width: "100px",
  height: "auto",
  marginBottom: "8px",
});
