import { vars } from "@nugudi/themes";
import { globalStyle, keyframes, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

const slideUp = keyframes({
  from: {
    transform: "translateX(-50%) translateY(100%)",
  },
  to: {
    transform: "translateX(-50%) translateY(0)",
  },
});

const slideDown = keyframes({
  from: {
    transform: "translateX(-50%) translateY(0)",
  },
  to: {
    transform: "translateX(-50%) translateY(100%)",
  },
});

export const modalContent = recipe({
  base: {
    position: "fixed",
    bottom: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: "100%",
    maxWidth: "100vw",
    height: "50%",
    maxHeight: "calc(100dvh - 40px)",
    backgroundColor: vars.colors.$static.light.color.white,
    padding: `${vars.box.spacing["6"]} ${vars.box.spacing["5"]}`,
    borderRadius: `${vars.box.radii["3xl"]} ${vars.box.radii["3xl"]} 0 0`,
    boxShadow: vars.box.shadows.xl,
    transition: "height 0.2s ease-out",
    willChange: "height",
    display: "flex",
    flexDirection: "column",
    zIndex: 10001,
    boxSizing: "border-box",
    overflowX: "hidden",
    touchAction: "none", // Prevent browser touch gestures interfering
    "@media": {
      "(min-width: 601px)": {
        width: "min(600px, 100vw)",
      },
    },
  },
  variants: {
    dragging: {
      true: {
        transition: "none",
      },
      false: {
        transition: "height 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
    visible: {
      true: {
        animation: `${slideUp} 0.3s ease-out`,
      },
      false: {
        animation: `${slideDown} 0.3s ease-out`,
      },
    },
  },
  defaultVariants: {
    dragging: false,
    visible: false,
  },
});

export const modalHeader = style({
  display: "flex",
  justifyContent: "center",
  marginBottom: "10px",
});

export const dragIcon = recipe({
  base: {
    cursor: "grab",
    userSelect: "none",
    padding: "15px 30px",
    marginTop: "-15px",
    marginBottom: "-10px",
    display: "inline-block",
    background: "transparent",
    border: "none",
    touchAction: "none", // Prevent browser touch gestures
    WebkitTapHighlightColor: "transparent", // Remove tap highlight on mobile
  },
  variants: {
    dragging: {
      true: {
        cursor: "grabbing",
      },
      false: {
        cursor: "grab",
      },
    },
  },
  defaultVariants: {
    dragging: false,
  },
});

export const dragIconLine = style({
  height: "4px",
  width: "48px",
  display: "block",
  backgroundColor: vars.colors.$scale.zinc[400],
  borderRadius: vars.box.radii.full,
  transition: "background-color 0.2s ease",
  ":hover": {
    backgroundColor: vars.colors.$scale.zinc[500],
  },
});

export const modalBody = style({
  width: "100%",
  flex: 1,
  overflowY: "auto",
  paddingTop: vars.box.spacing[3],
  minHeight: 0,
});

globalStyle(`${modalBody}::-webkit-scrollbar`, {
  display: "none",
});
