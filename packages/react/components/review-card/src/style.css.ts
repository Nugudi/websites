import { vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";

export const cardContainer = style({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  backgroundColor: vars.colors.$static.light.color.white,
  overflow: "hidden",
});

export const imageStyle = style({
  width: "100%",
  aspectRatio: "16/9",
  objectFit: "cover",
  display: "block",
  borderRadius: vars.box.radii["2xl"],
});

export const rightIconContainer = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "20px",
  height: "20px",
  overflow: "hidden",
  flexShrink: 0,
});

export const badgeScrollContainer = style({
  display: "flex",
  gap: "4px",
  overflowX: "auto",
  scrollbarWidth: "none",
  selectors: {
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
});
