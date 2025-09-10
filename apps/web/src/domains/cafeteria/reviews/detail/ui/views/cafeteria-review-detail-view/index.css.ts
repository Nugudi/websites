import { style } from "@vanilla-extract/css";

export const container = style({
  height: "100dvh",
});

export const navBarWrapper = style({
  flexShrink: 0,
});

export const content = style({
  flex: 1,
  overflowY: "auto",
});
