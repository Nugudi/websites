import { vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";

export const commentIcon = style({
  color: vars.colors.$scale.zinc[500],
  transition: "color 0.2s",
  cursor: "pointer",
  ":hover": {
    color: vars.colors.$scale.zinc[700],
  },
  ":focus": {
    color: vars.colors.$scale.zinc[700],
  },
  ":active": {
    color: vars.colors.$scale.zinc[900],
  },
});
