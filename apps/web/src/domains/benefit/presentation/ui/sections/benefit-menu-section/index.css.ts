import { vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";

export const container = style({
  flex: 1,
  backgroundColor: vars.colors.$static.light.color.white,
  borderTopLeftRadius: vars.box.radii["3xl"],
  borderTopRightRadius: vars.box.radii["3xl"],
  padding: vars.box.spacing[4],
});
