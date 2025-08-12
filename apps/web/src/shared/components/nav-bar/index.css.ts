import { classes, vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";

export const container = style({
  display: "flex",
  alignItems: "center",
  backgroundColor: vars.colors.$static.light.color.white,
  position: "sticky",
  top: 0,
  zIndex: 1,
  transition: "transform 0.3s ease",
});

export const hidden = style({
  transform: "translateY(-100%)",
});

export const backButton = style({
  backgroundColor: "transparent",
  border: "none",
  padding: "0",
  cursor: "pointer",
  position: "relative",
  transition: "color 0.2s ease",
  color: vars.colors.$scale.zinc[800],

  selectors: {
    "&::before": {
      content: '""',
      position: "absolute",
      top: "-12px",
      left: "-12px",
      right: "-12px",
      bottom: "-12px",
    },
    "&:hover": {
      color: vars.colors.$scale.main[500],
    },

    "&:focus-visible": {
      color: vars.colors.$scale.main[500],
    },
  },
});

export const title = style({
  flex: 1,
  textAlign: "center",
  ...classes.typography.body.b3,
  fontWeight: vars.typography.fontWeight[600],
  color: vars.colors.$scale.zinc[800],
  margin: 0,
  marginRight: "25px",
});
