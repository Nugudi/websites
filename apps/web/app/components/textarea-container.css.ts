import { style } from "@vanilla-extract/css";

export const form = style({
  display: "flex",
  flexDirection: "column",
  gap: "2rem",
  maxWidth: "600px",
  marginTop: "16px",
});

export const inner = style({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
});
