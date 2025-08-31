import { vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";

export const cardContainer = style({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  backgroundColor: vars.colors.$static.light.color.white,
  overflow: "hidden",
});

export const imageStyle = style({
  width: "100%",
  aspectRatio: "16/9",
  objectFit: "cover",
  display: "block",
  borderRadius: vars.box.radii.xl,
});
