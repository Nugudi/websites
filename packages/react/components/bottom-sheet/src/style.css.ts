import { vars } from "@nugudi/themes";
import { keyframes, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

const slideUp = keyframes({
  from: { transform: "translateY(100%)" },
  to: { transform: "translateY(0)" },
});

const slideDown = keyframes({
  from: { transform: "translateY(0)" },
  to: { transform: "translateY(100%)" },
});

export const containerStyle = recipe({
  base: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: vars.colors.$static.light.color.white,
    borderTopLeftRadius: vars.box.radii.xl,
    borderTopRightRadius: vars.box.radii.xl,
    boxShadow: vars.box.shadows.lg,
    zIndex: 1000,
    display: "flex",
    flexDirection: "column",
    touchAction: "none",
    userSelect: "none",
    overflow: "hidden",
    willChange: "transform, height",
  },
  variants: {
    state: {
      entering: {
        animation: `${slideUp} 0.3s cubic-bezier(0.32, 0.72, 0, 1)`,
        animationFillMode: "forwards",
      },
      entered: {
        transform: "translateY(0)",
      },
      exiting: {
        animation: `${slideDown} 0.3s cubic-bezier(0.32, 0.72, 0, 1)`,
        animationFillMode: "forwards",
      },
      exited: {
        transform: "translateY(100%)",
        visibility: "hidden",
      },
    },
    isDragging: {
      true: {
        transition: "none",
      },
      false: {
        transition: "height 0.3s cubic-bezier(0.32, 0.72, 0, 1)",
      },
    },
  },
  defaultVariants: {
    isDragging: false,
  },
});

export const handleContainerStyle = style({
  width: "100%",
  padding: "0.75rem",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "grab",
  touchAction: "none",
  background: "transparent",
  border: "none",
  outline: "none",
  selectors: {
    "&:active": {
      cursor: "grabbing",
    },
    "&:focus-visible": {
      outline: "2px solid",
      outlineColor: vars.colors.$scale.main[500],
      outlineOffset: "-2px",
      borderRadius: vars.box.radii.md,
    },
  },
});

export const handleStyle = style({
  width: "3rem",
  height: "0.25rem",
  borderRadius: vars.box.radii.full,
  backgroundColor: vars.colors.$scale.zinc[300],
});

export const contentStyle = style({
  flex: 1,
  overflowY: "auto",
  overflowX: "hidden",
  padding: "0 1.5rem 1.5rem",
  WebkitOverflowScrolling: "touch",
  minHeight: 0,
  maxHeight: "100%",
  scrollbarGutter: "stable",
});
