import { vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";

export const storyContainer = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.box.spacing[6],
});

export const storySection = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.box.spacing[1],
});

export const storyRow = style({
  display: "flex",
  flexWrap: "wrap",
  gap: vars.box.spacing[4],
  alignItems: "center",
});
