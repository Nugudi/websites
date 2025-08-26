import { style } from "@vanilla-extract/css";

export const container = style({
  minHeight: "100dvh",
  height: "100%",
  maxWidth: "600px",
  margin: "0 auto",
  position: "relative", // Bottom Sheet가 이 안에서만 나타나도록
  overflow: "hidden", // Bottom Sheet가 밖으로 나가지 않도록
});

export const contentWrapper = style({
  width: "100%",
});
