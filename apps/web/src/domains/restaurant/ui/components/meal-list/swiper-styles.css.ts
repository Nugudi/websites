import { classes, vars } from "@nugudi/themes";
import { globalStyle, style } from "@vanilla-extract/css";

export const container = style({
  position: "relative",
  width: "100%",
  maxWidth: "600px",
});

export const swiperContainer = style({
  width: "100%",
});

export const slideCounter = style({
  position: "absolute",
  top: "16px",
  right: "16px",
  backgroundColor: vars.colors.$scale.zinc[600],
  opacity: 0.8,
  color: vars.colors.$static.light.color.white,
  padding: "4px 8px",
  borderRadius: vars.box.radii["2xl"],
  ...classes.typography.emphasis.e2,
  fontWeight: vars.typography.fontWeight[600],

  zIndex: 10,
});

// 슬라이드 높이 고정
globalStyle(".swiper-slide", {
  height: "440px",
});

// Hide navigation buttons
globalStyle(".swiper-button-next, .swiper-button-prev", {
  display: "none",
});

globalStyle(".swiper-pagination", {
  display: "none",
});
