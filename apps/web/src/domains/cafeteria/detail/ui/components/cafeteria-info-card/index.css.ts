import { vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";

export const infoCard = style({
  backgroundColor: vars.colors.$static.light.color.white,
  borderRadius: vars.box.radii.xl,
  boxShadow: vars.box.shadows.md,
  position: "relative",
  zIndex: 1,
});

export const emphasisText = style({
  color: vars.colors.$scale.main[500],
});

export const nameText = style({
  lineClamp: 1,
});
