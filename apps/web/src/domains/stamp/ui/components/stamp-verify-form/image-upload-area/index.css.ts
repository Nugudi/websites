import { vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";

export const uploadContainer = style({
  width: "100%",
  aspectRatio: "1 / 1",
  position: "relative",
});

export const hiddenInput = style({
  display: "none",
});

export const uploadButton = style({
  width: "100%",
  height: "100%",
  backgroundColor: vars.colors.$scale.zinc[50],
  borderRadius: vars.box.radii.lg,
  border: `2px dashed ${vars.colors.$scale.zinc[300]}`,
  cursor: "pointer",
  transition: "all 0.2s ease",

  ":hover": {
    backgroundColor: vars.colors.$scale.zinc[100],
    borderColor: vars.colors.$scale.zinc[400],
  },
});

export const previewContainer = style({
  width: "100%",
  height: "100%",
  position: "relative",
  borderRadius: vars.box.radii.lg,
  overflow: "hidden",
});

export const previewImage = style({
  width: "100%",
  height: "100%",
  objectFit: "cover",
});

export const removeButton = style({
  position: "absolute",
  top: vars.box.spacing[12],
  right: vars.box.spacing[12],
  backgroundColor: vars.colors.$static.light.color.white,
  borderRadius: vars.box.radii.full,
  padding: vars.box.spacing[8],
  boxShadow: vars.box.shadows.md,
});
