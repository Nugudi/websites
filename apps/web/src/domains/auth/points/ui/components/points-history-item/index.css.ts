import { vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";

export const title = style({
  lineClamp: 1,
});

export const iconWrapper = style({
  backgroundColor: vars.colors.$scale.zinc[50],
});
