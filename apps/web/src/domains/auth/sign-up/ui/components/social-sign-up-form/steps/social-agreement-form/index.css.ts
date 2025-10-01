import { style } from "@vanilla-extract/css";

export const form = style({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100%",
  flex: 1,
});

export const titleContainer = style({
  marginTop: "40px",
  marginBottom: "60px",
});

export const descriptionContainer = style({
  marginTop: "12px",
  display: "flex",
  flexDirection: "column",
  gap: "4px",
});

export const agreementContainer = style({
  display: "flex",
  flex: 1,
  flexDirection: "column",
  gap: "0",
});

export const submitButton = style({
  marginTop: "auto",
  marginBottom: "40px",
  backgroundColor: "#4CAF50",
  borderRadius: "12px",
  height: "56px",
  fontSize: "18px",
  fontWeight: "600",

  ":disabled": {
    backgroundColor: "#ccc",
    cursor: "not-allowed",
  },
});
