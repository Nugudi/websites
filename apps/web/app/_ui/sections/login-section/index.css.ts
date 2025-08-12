import { classes, vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";

export const container = style({
  width: "100%",
  marginBottom: "16px",
  zIndex: 1,
});

export const content = style({
  width: "100%",
});

export const authLink = style({
  textDecoration: "none",
  color: vars.colors.$scale.zinc[500],
  ...classes.typography.body.b4,
  selectors: {
    "&:hover": {
      textDecoration: "underline",
    },
  },
});

export const divider = style({
  color: vars.colors.$scale.zinc[500],
  ...classes.typography.emphasis.e2,
});
