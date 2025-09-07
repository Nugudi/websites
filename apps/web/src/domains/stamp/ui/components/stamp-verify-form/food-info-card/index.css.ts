import { vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";

export const card = style({
  position: "relative",
  borderRadius: vars.box.radii.lg,
  border: `1px solid ${vars.colors.$scale.zinc[200]}`,
  backgroundColor: vars.colors.$static.light.color.white,
});

export const disclaimer = style({
  position: "absolute",
  bottom: -20,
  right: 4,
});
