import { style } from "@vanilla-extract/css";

export const container = style({
  position: "relative",
  height: 190,
});

export const imageWrapper = style({
  position: "absolute",
  bottom: -60,
  left: "50%",
  transform: "translateX(-50%)",
});
