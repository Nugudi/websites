import { vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";

export const scrollContainer = style({
  width: "100%",
  position: "relative",
});

export const scrollContent = style({
  overflowX: "auto",
  overflowY: "visible",
  display: "flex",
  gap: vars.box.spacing[8],
  padding: vars.box.spacing[1],
  msOverflowStyle: "none",
  scrollbarWidth: "none",
  WebkitOverflowScrolling: "touch",
  flexWrap: "nowrap",
  selectors: {
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
});

export const ratingChip = style({
  cursor: "pointer",
  transition: "all 0.2s ease",
  flexShrink: 0,
  ":hover": {
    transform: "scale(1.05)",
  },
});
