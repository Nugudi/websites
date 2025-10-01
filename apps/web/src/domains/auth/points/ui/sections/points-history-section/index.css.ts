import { vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";

export const container = style({
  padding: `${vars.box.spacing[20]} ${vars.box.spacing[16]}`,
  backgroundColor: vars.colors.$static.light.color.white,
});

export const dateLabel = style({
  color: vars.colors.$scale.zinc[500],
  fontWeight: 400,
  paddingLeft: vars.box.spacing[4],
});
