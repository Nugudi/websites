import { classes, vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";

export const commentContainer = style({
  display: "flex",
  gap: "12px",
  padding: "16px 0",
  borderBottom: `1px solid ${vars.colors.$scale.zinc[100]}`,

  selectors: {
    "&:last-child": {
      borderBottom: "none",
    },
  },
});

export const reply = style({
  paddingLeft: "48px",
  position: "relative",
});

export const replyIconWrapper = style({
  color: vars.colors.$scale.zinc[500],
  position: "absolute",
  left: "20px",
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
  gap: "12px",
  marginBottom: "12px",
});

export const avatarSection = style({
  flexShrink: 0,
  width: "40px",
  height: "40px",
});

export const defaultAvatar = style({
  width: "40px",
  height: "40px",
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
  gap: "8px",
  flexShrink: 1,
  minWidth: 0,
});

export const level = style({
  ...classes.typography.emphasis.e1,
  color: vars.colors.$scale.zinc[500],
  backgroundColor: vars.colors.$scale.zinc[100],
  padding: "2px 8px",
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
  marginLeft: "8px",
});

export const body = style({
  paddingLeft: "52px",
});

export const content = style({
  ...classes.typography.body.b3,
  color: vars.colors.$scale.zinc[700],
  wordBreak: "break-word",
  margin: 0,
});

export const replies = style({
  marginTop: "16px",
  borderTop: `1px solid ${vars.colors.$scale.zinc[100]}`,
  paddingTop: "16px",
});
