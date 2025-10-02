import { vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";

export const container = style({
  boxSizing: "border-box",
});

export const content = style({
  backgroundColor: vars.colors.$static.light.zinc[50],
});
