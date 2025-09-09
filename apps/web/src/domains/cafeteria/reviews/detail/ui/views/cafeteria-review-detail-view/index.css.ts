import { style } from "@vanilla-extract/css";

export const container = style({
  display: "flex",
  flexDirection: "column",
  height: "100vh",
});

export const navBarWrapper = style({
  flexShrink: 0,
});

export const content = style({
  flex: 1,
  overflowY: "auto",
});

export const inputWrapper = style({
  flexShrink: 0,
});
