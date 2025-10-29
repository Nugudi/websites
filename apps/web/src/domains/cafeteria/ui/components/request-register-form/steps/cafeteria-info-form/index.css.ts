import { vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";

export const title = style({
  fontWeight: vars.typography.fontWeight[600],
});

export const imageUploadBox = style({
  cursor: "pointer",
  color: vars.colors.$scale.zinc[400],
  backgroundColor: vars.colors.$scale.zinc[100],
  ":hover": {
    backgroundColor: vars.colors.$scale.zinc[200],
  },
});

export const mapContainer = style({
  backgroundColor: vars.colors.$scale.zinc[100],
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const container = style({
  flex: 1,
});
