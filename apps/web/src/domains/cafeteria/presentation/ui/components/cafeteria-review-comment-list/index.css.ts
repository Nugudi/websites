import { classes, vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";

export const showRepliesButton = style({
  ...classes.typography.emphasis.e2,
  backgroundColor: "transparent",
  border: "none",
  color: vars.colors.$scale.zinc[500],
  fontWeight: vars.typography.fontWeight[600],
  paddingLeft: vars.box.spacing[6],
  cursor: "pointer",
  textAlign: "left",
  position: "relative",

  selectors: {
    "&::before": {
      content: '""',
      position: "absolute",
      left: 0,
      top: "50%",
      transform: "translateY(-50%)",
      width: vars.box.spacing[3],
      height: "1px",
      backgroundColor: vars.colors.$scale.zinc[300],
    },
    "&:hover": {
      color: vars.colors.$scale.zinc[700],
    },
    "&:focus": {
      color: vars.colors.$scale.zinc[700],
      outline: "none",
    },
  },
});

export const replyItem = style({
  marginTop: vars.box.spacing[2],
});
