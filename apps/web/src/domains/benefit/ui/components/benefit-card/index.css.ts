import { vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";

export const card = style({
  height: "152px",
  backgroundColor: vars.colors.$scale.whiteAlpha[100],
  border: `1px solid ${vars.colors.$scale.zinc[50]}`,
  borderRadius: "10px",
  padding: vars.box.spacing[16],
  display: "flex",
  position: "relative",
  cursor: "pointer",
  transition: "all 0.2s ease",
  ":hover": {
    transform: "translateY(-2px)",
    boxShadow: vars.box.shadows.sm,
  },
});

export const contentWrapper = style({
  display: "flex",
  flexDirection: "column",
  position: "absolute",
  textAlign: "left",
  top: 20,
  left: 20,
  gap: vars.box.spacing[4],
});

export const iconWrapper = style({
  position: "absolute",
  bottom: vars.box.spacing[8],
  right: vars.box.spacing[8],
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});
