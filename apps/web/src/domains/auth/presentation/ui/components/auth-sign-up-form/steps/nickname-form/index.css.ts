import { style } from "@vanilla-extract/css";

export const titleContainer = style({
  marginTop: "32px",
});

export const form = style({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100%",
  flex: 1,
});

export const inputContainer = style({
  flex: 1,
  marginTop: "32px",
  display: "flex",
  flexDirection: "column",
  gap: "42px",
});

export const imageContainer = style({
  padding: 36,
});
