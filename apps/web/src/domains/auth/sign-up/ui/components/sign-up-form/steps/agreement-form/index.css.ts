import { style } from "@vanilla-extract/css";

export const form = style({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100vh",
  padding: "0 20px",
  backgroundColor: "#fff",
});

export const header = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  paddingTop: "20px",
  paddingBottom: "20px",
});

export const backButton = style({
  background: "none",
  border: "none",
  padding: "8px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const profileSection = style({
  alignItems: "center",
  gap: "12px",
});

export const profileImageContainer = style({
  position: "relative",
  display: "flex",
  alignItems: "center",
  gap: "8px",
});

export const profileImage = style({
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  backgroundColor: "#4285f4",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
});

export const profileInitial = style({
  color: "white",
  fontSize: "16px",
  fontWeight: "600",
});

export const profileCat = style({
  position: "absolute",
  right: "-8px",
  bottom: "-4px",
  width: "32px",
  height: "32px",
  borderRadius: "50%",
  border: "2px solid white",
  backgroundColor: "#f0f0f0",
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
  flex: 1,
  display: "flex",
  flexDirection: "column",
  gap: "0",
});

export const agreementItem = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "20px 0",
  borderBottom: "1px solid #f5f5f5",
  selectors: {
    "&:first-child": {
      borderBottom: "1px solid #e0e0e0",
      marginBottom: "16px",
    },
  },
});

export const agreementLabel = style({
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  flex: 1,
});

export const checkbox = style({
  display: "none",
});

export const checkmark = style({
  width: "24px",
  height: "24px",
  borderRadius: "4px",
  border: "2px solid #ddd",
  marginRight: "12px",
  position: "relative",
  transition: "all 0.2s ease",

  selectors: {
    [`${checkbox}:checked + &`]: {
      backgroundColor: "#4CAF50",
      borderColor: "#4CAF50",
    },

    [`${checkbox}:checked + &::after`]: {
      content: "",
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%) rotate(45deg)",
      width: "6px",
      height: "10px",
      border: "solid white",
      borderWidth: "0 2px 2px 0",
    },
  },
});

export const checked = style({
  backgroundColor: "#4CAF50",
  borderColor: "#4CAF50",

  "::after": {
    content: "",
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%) rotate(45deg)",
    width: "6px",
    height: "10px",
    border: "solid white",
    borderWidth: "0 2px 2px 0",
  },
});

export const agreementText = style({
  fontSize: "16px",
  color: "#333",
  fontWeight: "500",
});

export const arrowButton = style({
  background: "none",
  border: "none",
  padding: "8px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
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
