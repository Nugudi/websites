import { vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";

export const notificationItem = style({
  padding: `${vars.box.spacing[8]}`,
  cursor: "pointer",
  transition: "background-color 0.2s ease",
  borderBottom: `1px solid ${vars.colors.$scale.zinc[100]}`,

  ":hover": {
    backgroundColor: vars.colors.$scale.zinc[50],
  },

  ":active": {
    backgroundColor: vars.colors.$scale.zinc[100],
  },
});

export const unread = style({
  backgroundColor: vars.colors.$scale.main[50],

  ":hover": {
    backgroundColor: vars.colors.$scale.main[100],
  },
});

export const read = style({
  backgroundColor: "white",
});

export const iconWrapper = style({
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 36,
  height: 36,
  borderRadius: "50%",
  backgroundColor: vars.colors.$scale.zinc[100],
  color: vars.colors.$scale.zinc[600],
});

export const contentWrapper = style({
  flex: 1,
  minWidth: 0,
});

export const title = style({
  color: vars.colors.$scale.zinc[800],
  fontWeight: 500,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  flex: 1,
  fontSize: "14px",
  lineHeight: 1.3,
});

export const content = style({
  color: vars.colors.$scale.zinc[600],
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  lineHeight: 1.3,
  fontSize: "13px",
  marginTop: "2px",
});

export const timestamp = style({
  color: vars.colors.$scale.zinc[400],
  flexShrink: 0,
  marginLeft: vars.box.spacing[8],
  fontSize: "12px",
});

export const linkText = style({
  color: vars.colors.$scale.blue[600],
  marginTop: vars.box.spacing[2],
  cursor: "pointer",
  fontSize: "12px",

  ":hover": {
    textDecoration: "underline",
  },
});

export const iconStyle = style({
  width: "20px",
  height: "20px",
});
