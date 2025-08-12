import { classes, vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";

export const container = style({
  position: "relative",
  display: "flex",
  width: "calc(100% - 32px)",
  alignItems: "center",
  gap: vars.box.spacing[4],
  margin: `${vars.box.spacing[6]} auto`,
});

export const divider = style({
  flexGrow: 1,
  borderTop: "1px solid",
  borderColor: vars.colors.$scale.zinc[200],
});

export const text = style({
  color: vars.colors.$scale.zinc[300],
  ...classes.typography.body.b4,
});
