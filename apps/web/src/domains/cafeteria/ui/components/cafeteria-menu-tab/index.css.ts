import { style } from "@vanilla-extract/css";

export const reviewPromptCard = style({
  position: "relative",
  overflow: "hidden",
  width: "100%",
  maxWidth: "100%",
});

export const buttonBox = style({
  position: "relative",
  width: "100%",
  maxWidth: "100%",
});

export const characterImageBox = style({
  position: "absolute",
  top: -60,
  right: 16,
  zIndex: 1,
  maxWidth: "80px",
});

export const writeReviewButton = style({
  position: "relative",
  zIndex: 2,
  maxWidth: "100%",
});
