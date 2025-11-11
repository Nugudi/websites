import { vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";

export const container = style({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: vars.colors.$scale.zinc[100],
  borderRadius: vars.box.radii.xl,
  width: "100%",
  aspectRatio: "1 / 1",
});

export const iconWrapper = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "transparent",
  width: "100%",
  height: "100%",
  color: vars.colors.$scale.zinc[400],
});
