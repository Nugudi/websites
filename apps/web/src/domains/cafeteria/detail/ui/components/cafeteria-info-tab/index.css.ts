import { vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";

export const nutritionSection = style({
  border: `1px solid ${vars.colors.$scale.zinc[100]}`,
});

export const mapPlaceholder = style({
  backgroundColor: vars.colors.$scale.zinc[100],
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});
