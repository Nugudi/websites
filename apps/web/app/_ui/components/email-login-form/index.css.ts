import { classes, vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";

export const form = style({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100%",
  flex: 1,
});

export const inputContainer = style({
  flex: 1,
});

export const linksContainer = style({
  marginTop: "24px",
});

export const authLink = style({
  textDecoration: "none",
  color: vars.colors.$scale.zinc[500],
  ...classes.typography.body.b4,
  ":hover": {
    textDecoration: "underline",
  },
});

export const divider = style({
  color: vars.colors.$scale.zinc[500],
  ...classes.typography.emphasis.e2,
});

export const buttonContainer = style({
  marginTop: "auto",
  paddingTop: "2rem",
});
