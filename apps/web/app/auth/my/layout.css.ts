import { style } from "@vanilla-extract/css";

export const container = style({
  minHeight: "100dvh",
  height: "100%",
  width: "100%",
});

export const contentWrapper = style({
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
});
