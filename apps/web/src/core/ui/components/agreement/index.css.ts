import { style } from "@vanilla-extract/css";

export const agreementItem = style({
  cursor: "pointer",
  listStyle: "none",
  padding: "12px 16px",
  margin: "0 -16px",
  minHeight: "52px",
  borderRadius: "8px",
  transition: "background-color 0.2s ease",
  ":hover": {
    backgroundColor: "rgba(0, 0, 0, 0.02)",
  },
});

export const arrowIcon = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "44px",
  height: "44px",
  cursor: "pointer",
  borderRadius: "8px",
  transition: "background-color 0.2s ease",
  ":hover": {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
});
