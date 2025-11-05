import { style } from "@vanilla-extract/css";

export const form = style({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100%",
  flex: 1,
});

export const titleContainer = style({
  marginTop: "32px",
});

export const inputContainer = style({
  flex: 1,
  marginTop: "32px",
});
