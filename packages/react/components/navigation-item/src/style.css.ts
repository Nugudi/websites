import { classes, vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

export const navigationItemStyle = recipe({
  base: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    cursor: "pointer",
    transition: "all 0.2s ease",
    borderRadius: vars.box.radii.lg,
    userSelect: "none",
    outline: "none",
    position: "relative",
    border: "none",
    backgroundColor: "transparent",
    padding: "8px 16px",
    gap: "12px",
    ":hover": {
      backgroundColor: vars.colors.$scale.zinc[50],
    },
    ":focus-visible": {
      backgroundColor: vars.colors.$scale.zinc[50],
    },
  },
  variants: {
    size: {
      sm: {
        minHeight: "32px",
      },
      md: {
        minHeight: "40px",
      },
      lg: {
        minHeight: "48px",
      },
    },
    disabled: {
      true: {
        opacity: 0.5,
        cursor: "not-allowed",
        pointerEvents: "none",
      },
    },
  },
  defaultVariants: {
    size: "md",
    disabled: false,
  },
});

// 공통 아이콘 스타일
const iconBaseStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  color: vars.colors.$scale.zinc[500],
} as const;

const iconSizeVariants = {
  sm: {
    width: "16px",
    height: "16px",
  },
  md: {
    width: "24px",
    height: "24px",
  },
  lg: {
    width: "40px",
    height: "40px",
  },
} as const;

export const leftIconStyle = recipe({
  base: iconBaseStyle,
  variants: {
    size: iconSizeVariants,
  },
  defaultVariants: {
    size: "md",
  },
});

export const labelStyle = style({
  flex: 1,
  display: "flex",
  textAlign: "left",
  color: vars.colors.$scale.zinc[600],
  ...classes.typography.body.b3,
});

export const rightIconStyle = recipe({
  base: iconBaseStyle,
  variants: {
    size: iconSizeVariants,
  },
  defaultVariants: {
    size: "md",
  },
});
