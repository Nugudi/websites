import { classes, vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";

export const commentContainer = style({
  display: "flex",
  gap: vars.box.spacing[3],
  padding: `${vars.box.spacing[4]} 0`,
  borderBottom: `1px solid ${vars.colors.$scale.zinc[100]}`,

  selectors: {
    "&:last-child": {
      borderBottom: "none",
    },
  },
});

export const reply = style({
  paddingLeft: vars.box.spacing[12],
  position: "relative",
});

export const replyIconWrapper = style({
  color: vars.colors.$scale.zinc[500],
  position: "absolute",
  left: vars.box.spacing[5],
  top: "18px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const commentContent = style({
  flex: 1,
  minWidth: 0,
});

export const header = style({
  display: "flex",
  gap: vars.box.spacing[3],
  marginBottom: vars.box.spacing[3],
});

export const avatarSection = style({
  flexShrink: 0,
  width: "30px",
  height: "30px",
});

export const defaultAvatar = style({
  width: "30px",
  height: "30px",
  borderRadius: "50%",
  backgroundColor: vars.colors.$scale.zinc[300],
});

export const headerInfo = style({
  flex: 1,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  minWidth: 0,
});

export const userInfo = style({
  display: "flex",
  alignItems: "center",
  gap: vars.box.spacing[2],
  flexShrink: 1,
  minWidth: 0,
});

export const level = style({
  ...classes.typography.emphasis.e1,
  color: vars.colors.$scale.zinc[500],
  backgroundColor: vars.colors.$scale.zinc[100],
  padding: `2px ${vars.box.spacing[2]}`,
  borderRadius: vars.box.radii.sm,
  flexShrink: 0,
});

export const username = style({
  ...classes.typography.emphasis.e1,
  color: vars.colors.$scale.zinc[900],
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const timeAgo = style({
  ...classes.typography.emphasis.e2,
  color: vars.colors.$scale.zinc[400],
  flexShrink: 0,
  marginLeft: vars.box.spacing[2],
});

export const body = style({
  paddingLeft: "42px",
});

export const content = style({
  ...classes.typography.body.b3,
  color: vars.colors.$scale.zinc[700],
  wordBreak: "break-word",
  margin: 0,
});

export const replies = style({
  marginTop: vars.box.spacing[4],
  borderTop: `1px solid ${vars.colors.$scale.zinc[100]}`,
});

export const replyButtonWrapper = style({
  marginTop: vars.box.spacing[2],
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  width: "100%",
});

export const replyButton = style({
  ...classes.typography.emphasis.e1,
  padding: `${vars.box.spacing[1]} 0`,
  color: vars.colors.$scale.main[500],
  backgroundColor: "transparent",
  cursor: "pointer",
  transition: "all 0.2s ease",
  border: "none",

  selectors: {
    "&:hover": {
      color: vars.colors.$scale.main[700],
    },
    "&:active": {
      color: vars.colors.$scale.main[700],
    },
  },
});
