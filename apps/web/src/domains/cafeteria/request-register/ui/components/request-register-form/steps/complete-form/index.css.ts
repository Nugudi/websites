import { keyframes, style } from "@vanilla-extract/css";

const fadeInScale = keyframes({
  "0%": {
    opacity: 0,
    transform: "scale(0.95)",
  },
  "100%": {
    opacity: 1,
    transform: "scale(1)",
  },
});

export const container = style({
  flex: 1,
});

export const content = style({
  flex: 1,
  animation: `${fadeInScale} 0.5s ease-out`,
});
