import { classes, vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";

export const menuCardWrapper = style({
  backgroundColor: vars.colors.$static.light.color.white,
  borderRadius: vars.box.radii.xl,
  border: `1px solid ${vars.colors.$scale.zinc[100]}`,
  padding: "16px",
  boxSizing: "border-box",
  width: "100%",
});

export const menuCardHeader = style({
  display: "flex",
  alignItems: "flex-start",
  flexDirection: "column",
  gap: "4px",
  marginBottom: "16px",
});

export const menuCardTitleContainer = style({
  display: "flex",
  alignItems: "center",
  gap: "16px",
});

export const menuCardPackagingAvailable = style({
  display: "flex",
  alignItems: "center",
  gap: "4px",
  ...classes.typography.emphasis.e1,
  color: vars.colors.$scale.main[600],
  margin: 0,
});

export const menuCardTitle = style({
  ...classes.typography.title.t3,
  fontWeight: vars.typography.fontWeight[600],
  color: vars.colors.$scale.zinc[700],
  margin: 0,
  maxWidth: "200px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const menuCardSubtitle = style({
  ...classes.typography.emphasis.e2,
  color: vars.colors.$scale.zinc[500],
  margin: 0,
});

export const menuCardTimeRange = style({
  display: "flex",
  alignItems: "center",
  gap: "4px",
  ...classes.typography.emphasis.e2,
  color: vars.colors.$scale.zinc[500],
  marginTop: "4px",
});

export const menuItemsContainer = style({
  display: "flex",
  alignItems: "flex-start",
  flexDirection: "column",
  gap: "8px",
});

/* CategoryGroupComponent */
export const categoryGroupWrapper = style({
  display: "flex",
  alignItems: "center",
  gap: "12px",
});

export const categoryLabel = style({
  ...classes.typography.body.b4,
  color: vars.colors.$scale.zinc[800],
  flex: 1,
});

export const categoryIcon = style({
  width: "24px",
  height: "24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
});
