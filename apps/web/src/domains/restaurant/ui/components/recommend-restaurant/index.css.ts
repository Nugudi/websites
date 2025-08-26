import { classes, vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";

export const container = style({
  display: "flex",
  justifyContent: "space-between",
  position: "relative",
  width: "100%",
  height: "100%",
  textDecoration: "none",
  color: vars.colors.$scale.zinc[400],
  ...classes.typography.emphasis.e2,

  border: `1px solid ${vars.colors.$scale.zinc[100]}`,
  borderRadius: vars.box.radii["2xl"],
  padding: "16px",
  boxSizing: "border-box",
  background: vars.colors.$static.light.color.white,
  overflow: "hidden",

  ":hover": {
    boxShadow: vars.box.shadows.sm,
    transition: "all 0.2s ease-in-out",
  },
});

export const restaurantName = style({
  ...classes.typography.body.b1,
  fontWeight: vars.typography.fontWeight[600],
  color: vars.colors.$scale.zinc[800],
});

export const availablePackagingText = style({
  color: vars.colors.$scale.main[600],
});

export const restaurantTime = style({
  display: "flex",
  alignItems: "center",
  gap: "4px",
  marginTop: "8px",
});

export const logoImage = style({
  position: "absolute",
  right: "4px",
  bottom: "-24px",
  width: "150px",
  objectFit: "contain",
});
