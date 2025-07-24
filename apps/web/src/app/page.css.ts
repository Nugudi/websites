import { vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";

export const container = style({
  minHeight: "100vh",
  padding: "2rem",
  backgroundColor: vars.colors.$scale.zinc[50],
});

export const section = style({
  marginBottom: "2rem",
});

export const colorPalette = style({
  display: "flex",
  gap: "1rem",
  marginTop: "1rem",
});

export const colorBox = style({
  width: "3rem",
  height: "3rem",
  borderRadius: "0.25rem",
});

export const zincLight = style({
  backgroundColor: vars.colors.$scale.zinc[100],
});

export const zincMedium = style({
  backgroundColor: vars.colors.$scale.zinc[500],
});

export const zincDark = style({
  backgroundColor: vars.colors.$scale.zinc[800],
});

export const mainColor = style({
  backgroundColor: vars.colors.$scale.main[500],
});

export const testGuide = style({
  position: "fixed",
  right: "1rem",
  bottom: "1rem",
  padding: "0.75rem",
  backgroundColor: vars.colors.$scale.system.white,
  border: `1px solid ${vars.colors.$scale.zinc[200]}`,
  borderRadius: "0.25rem",
  fontSize: "0.875rem",
  color: vars.colors.$scale.zinc[700],
});
