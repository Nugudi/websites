import { classes, vars } from "@nugudi/themes";
import { globalStyle, style } from "@vanilla-extract/css";

export const container = style({
  position: "relative",
  width: "100%",
});

export const swiperContainer = style({
  width: "100%",
});

const baseCounterStyle = {
  position: "absolute" as const,
  backgroundColor: vars.colors.$scale.zinc[600],
  opacity: 0.8,
  color: vars.colors.$static.light.color.white,
  padding: "4px 8px",
  borderRadius: vars.box.radii["2xl"],
  ...classes.typography.emphasis.e2,
  fontWeight: vars.typography.fontWeight[600],
  zIndex: 10,
};

export const slideCounter = {
  "top-right": style({
    ...baseCounterStyle,
    top: "16px",
    right: "16px",
  }),
  "top-left": style({
    ...baseCounterStyle,
    top: "16px",
    left: "16px",
  }),
  "bottom-right": style({
    ...baseCounterStyle,
    bottom: "16px",
    right: "16px",
  }),
  "bottom-left": style({
    ...baseCounterStyle,
    bottom: "16px",
    left: "16px",
  }),
};

// Hide navigation buttons
globalStyle(".swiper-button-next, .swiper-button-prev", {
  display: "none",
});

globalStyle(".swiper-pagination", {
  display: "none",
});
