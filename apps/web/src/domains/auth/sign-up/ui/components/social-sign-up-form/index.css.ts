import { vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";

export const container = style({
  width: "100%",
  gap: vars.box.spacing[32],
  paddingTop: vars.box.spacing[40],
  paddingBottom: vars.box.spacing[40],
  paddingLeft: vars.box.spacing[20],
  paddingRight: vars.box.spacing[20],
});
