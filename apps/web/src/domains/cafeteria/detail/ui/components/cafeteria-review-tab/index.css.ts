import { style } from "@vanilla-extract/css";

export const reviewPromptCard = style({
  position: "relative",
  overflow: "hidden",
});

export const buttonBox = style({
  position: "relative",
});

export const characterImageBox = style({
  position: "absolute",
  top: -60,
  right: 0,
  zIndex: 1,
});

export const writeReviewButton = style({
  position: "relative",
  zIndex: 2,
});
