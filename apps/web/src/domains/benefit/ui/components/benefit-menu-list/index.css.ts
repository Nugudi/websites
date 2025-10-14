import { vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";

export const linkWrapper = style({
  textDecoration: "none",
});

export const leftIcon = style({
  padding: vars.box.spacing[2],
  borderRadius: vars.box.radii.xl,
  backgroundColor: vars.colors.$scale.zinc[100],
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});
