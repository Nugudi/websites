import { vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";

export const iconContainer = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: vars.box.spacing[3],
  borderRadius: vars.box.radii.md,
  border: `1px solid ${vars.colors.$scale.zinc[200]}`,
  backgroundColor: vars.colors.$scale.zinc[50],
  padding: vars.box.spacing[4],
});

export const iconLibraryContainer = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.box.spacing[16],
  padding: vars.box.spacing[8],
});

export const iconLibraryTitle = style({
  marginBottom: vars.box.spacing[6],
  fontWeight: vars.typography.fontWeight[700],
  fontSize: vars.typography.fontSize[30],
  color: vars.colors.$scale.zinc[800],
});

export const iconGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: vars.box.spacing[6],
  "@media": {
    "(min-width: 640px)": {
      gridTemplateColumns: "repeat(4, 1fr)",
    },
    "(min-width: 768px)": {
      gridTemplateColumns: "repeat(5, 1fr)",
    },
    "(min-width: 1024px)": {
      gridTemplateColumns: "repeat(5, 1fr)",
    },
    "(min-width: 1280px)": {
      gridTemplateColumns: "repeat(6, 1fr)",
    },
  },
});

export const iconCode = style({
  wordBreak: "break-word",
  textAlign: "center",
  color: vars.colors.$scale.zinc[600],
});

export const searchInput = style({
  width: "100%",
  padding: vars.box.spacing[3],
  borderRadius: vars.box.radii.md,
  border: `1px solid ${vars.colors.$scale.zinc[300]}`,
  fontSize: vars.typography.fontSize[16],
  "::placeholder": {
    color: vars.colors.$scale.zinc[400],
  },
  ":focus": {
    outline: "none",
    borderColor: vars.colors.$scale.main[500],
    boxShadow: `0 0 0 3px ${vars.colors.$scale.zinc[100]}`,
  },
});
