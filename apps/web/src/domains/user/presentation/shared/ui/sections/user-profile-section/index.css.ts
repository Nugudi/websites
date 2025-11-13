import { classes, vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";

export const container = style({
  width: "100%",
  gap: "16px",
  paddingLeft: vars.box.spacing[4],
  paddingRight: vars.box.spacing[4],
  boxSizing: "border-box",
  alignItems: "center",
});

export const profileImage = style({
  objectFit: "contain",
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

export const nameSuffix = style({
  ...classes.typography.body.b4,
});

export const editButton = style({
  position: "relative",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: vars.colors.$scale.zinc[600],
  cursor: "pointer",
  transition: "color 0.2s ease",
  "::before": {
    content: '""',
    position: "absolute",
    inset: "-12px",
    zIndex: 0,
  },
  ":hover": {
    color: vars.colors.$scale.main[500],
  },
});
