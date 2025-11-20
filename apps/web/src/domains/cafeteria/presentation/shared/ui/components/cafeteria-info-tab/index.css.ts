import { vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";

export const infoSection = style({
  border: `1px solid ${vars.colors.$scale.zinc[100]}`,
  backgroundColor: vars.colors.$scale.zinc[50],
});

export const mapPlaceholder = style({
  border: `1px solid ${vars.colors.$scale.zinc[100]}`,
  backgroundColor: vars.colors.$scale.zinc[50],
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const infoIcon = style({
  color: vars.colors.$scale.zinc[500],
});

export const infoLabel = style({
  wordBreak: "keep-all",
});
