import { classes, vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";

export const replyIndicator = style({
  padding: `${vars.box.spacing[2]} ${vars.box.spacing[3]}`,
  backgroundColor: vars.colors.$scale.zinc[50],
  borderRadius: vars.box.radii.xl,
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

export const cancelButton = style({
  padding: `${vars.box.spacing[1]} ${vars.box.spacing[2]}`,
  ...classes.typography.emphasis.e2,
  color: vars.colors.$scale.zinc[600],
  backgroundColor: vars.colors.$scale.zinc[200],
  border: "none",
  cursor: "pointer",
  borderRadius: vars.box.radii.full,
  transition: "background-color 0.2s",

  selectors: {
    "&:hover": {
      backgroundColor: vars.colors.$scale.zinc[200],
    },
  },
});
