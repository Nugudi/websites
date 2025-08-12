import { classes, vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";

export const container = style({
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  padding: "8px 0",
  backgroundColor: vars.colors.$static.light.color.white,
  boxShadow: "rgb(238, 238, 238) 0px 1px 0px inset",
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
  color: vars.colors.$scale.zinc[400],
  textDecoration: "none",

  selectors: {
    "&:hover": {
      transform: "scale(1.05)",
    },
  },
});

export const active = style({
  color: vars.colors.$scale.main[500],
});

export const label = style({
  ...classes.typography.emphasis.e2,
  color: "inherit",
});
