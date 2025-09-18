import { vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";

export const emptyContainer = style({
  padding: `${vars.box.spacing[60]} ${vars.box.spacing[20]}`,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "400px",
});

export const emptyIcon = style({
  width: 64,
  height: 64,
  color: vars.colors.$scale.zinc[300],
});

export const emptyTitle = style({
  color: vars.colors.$scale.zinc[700],
  fontWeight: 500,
  textAlign: "center",
});

export const emptyDescription = style({
  color: vars.colors.$scale.zinc[500],
  textAlign: "center",
});
