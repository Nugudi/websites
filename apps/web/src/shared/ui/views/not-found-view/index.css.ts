import { vars } from "@nugudi/themes";
import { keyframes, style } from "@vanilla-extract/css";

const float = keyframes({
  "0%, 100%": {
    transform: "translateY(0)",
  },
  "50%": {
    transform: "translateY(-20px)",
  },
});

export const container = style({
  width: "100%",
  height: "100vh",
  background: `linear-gradient(135deg, ${vars.colors.$static.light.main[500]} 0%, ${vars.colors.$static.light.main[600]} 100%)`,
  textAlign: "center",
  overflow: "hidden",
});

export const imageWrapper = style({
  padding: `${vars.box.spacing[6]}`,
  animation: `${float} 3s ease-in-out infinite`,
  "@media": {
    "(prefers-reduced-motion: reduce)": {
      animation: "none",
    },
  },
});

export const button = style({
  transition: "all 0.2s ease",
  ":hover": {
    transform: "translateY(-2px)",
    boxShadow: vars.box.shadows.lg,
  },
  ":active": {
    transform: "translateY(0)",
  },
});
