import { vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";

export const container = style({
  boxSizing: "border-box",
  backgroundColor: vars.colors.$scale.zinc[50],
  minHeight: "100vh",
});
