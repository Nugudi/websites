import { classes, vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

export const container = recipe({
  base: {
    display: "flex",
    alignItems: "center",
    position: "sticky",
    top: 0,
    zIndex: 9999,
    transition: "transform 0.3s ease",
    height: vars.box.spacing[12],
  },
  variants: {
    background: {
      white: {
        backgroundColor: vars.colors.$static.light.color.white,
      },
      transparent: {
        backgroundColor: "transparent",
      },
      blur: {
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        backdropFilter: "blur(8px)",
      },
    },
    padding: {
      none: {
        padding: 0,
      },
      default: {
        padding: `0 ${vars.box.spacing[4]}`, // 0 16px
      },
    },
  },
  defaultVariants: {
    background: "white",
    padding: "default",
  },
});

export const backButton = style({
  backgroundColor: "transparent",
  border: "none",
  padding: "0",
  cursor: "pointer",
  position: "relative",
  transition: "color 0.2s ease",
  color: vars.colors.$scale.zinc[800],

  selectors: {
    "&::before": {
      content: '""',
      position: "absolute",
      top: "-12px",
      left: "-12px",
      right: "-12px",
      bottom: "-12px",
    },
    "&:hover": {
      color: vars.colors.$scale.main[500],
    },

    "&:focus-visible": {
      color: vars.colors.$scale.main[500],
    },
  },
});

export const title = style({
  flex: 1,
  textAlign: "center",
  ...classes.typography.body.b3,
  fontWeight: vars.typography.fontWeight[600],
  color: vars.colors.$scale.zinc[800],
  margin: 0,
  marginRight: "25px",
});
