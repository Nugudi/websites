import { classes, vars } from "@nugudi/themes";
import { keyframes, style } from "@vanilla-extract/css";

const bounceAnimation = keyframes({
  "0%": {
    transform: "scale(1)",
  },
  "50%": {
    transform: "scale(1.05)",
  },
  "100%": {
    transform: "scale(1)",
  },
});

export const container = style({
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  padding: "8px 0",
  backgroundColor: vars.colors.$static.light.color.white,
  borderTopRightRadius: vars.box.radii["3xl"],
  borderTopLeftRadius: vars.box.radii["3xl"],
  borderTop: `1px solid ${vars.colors.$scale.zinc[100]}`,
  position: "fixed",
  bottom: 0,
  zIndex: 1,
  width: "100%",
  maxWidth: "600px",
});

export const tab = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "4px",
  padding: "4px 12px",
  border: "none",
  backgroundColor: "transparent",
  cursor: "pointer",
  transition: "all 0.3s ease",
  minWidth: "60px",
  color: vars.colors.$scale.zinc[300],
  textDecoration: "none",
});

export const active = style({
  color: vars.colors.$scale.zinc[500],
  animation: `${bounceAnimation} 1s ease-in-out`,
});

export const label = style({
  ...classes.typography.emphasis.e2,
  color: "inherit",
});
