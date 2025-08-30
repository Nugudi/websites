import { classes, vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";

export const container = style({
  width: "100%",
  gap: "16px",
  padding: "16px",
  boxSizing: "border-box",
  alignItems: "center",
});

export const profileImage = style({
  objectFit: "cover",
});

export const infoWrapper = style({
  gap: "2px",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "flex-start",
  flex: 1,
});

export const levelText = style({
  ...classes.typography.emphasis.e1,
  color: vars.colors.$scale.main[500],
});

export const nameText = style({
  ...classes.typography.title.t3,
  fontWeight: vars.typography.fontWeight[600],
  color: vars.colors.$scale.zinc[600],
});

export const nameSuffix = style({
  ...classes.typography.body.b4,
});

export const editButton = style({
  color: vars.colors.$scale.zinc[600],
  ":hover": {
    color: vars.colors.$scale.main[500],
  },
});
