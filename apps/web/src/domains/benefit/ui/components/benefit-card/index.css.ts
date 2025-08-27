import { vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";

export const card = style({
  width: "149px",
  height: "152px",
  backgroundColor: vars.colors.$scale.whiteAlpha[100],
  borderRadius: vars.box.radii.lg,
  padding: vars.box.spacing[16],
  boxShadow: vars.box.shadows.sm,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  cursor: "pointer",
  transition: "all 0.2s ease",
  ":hover": {
    boxShadow: vars.box.shadows.md,
    transform: "translateY(-2px)",
  },
});
