import { classes, vars } from "@nugudi/themes";
import { createVar, keyframes } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

export const enableColorVariant = createVar();
export const hoverColorVariant = createVar();
export const activeColorVariant = createVar();

export const buttonStyle = recipe({
  base: {
    margin: 0,
    padding: 0,
    border: 0,
    background: "none",

    borderRadius: vars.box.radii.md,
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    userSelect: "none",
    transition: "background-color 0.2s, color 0.2s, border-color 0.2s",
    // @ts-ignore
    "&[disabled]": {
      opacity: 0.4,
      cursor: "not-allowed",
    },
    '&[data-loading="true"]': {
      "& span": {
        opacity: 0,
      },
    },
    "&:focus-visible": {
      outline: "none",

      boxShadow: vars.box.shadows.outline,
    },
  },
  variants: {
    size: {
      xs: {
        ...classes.typography.body.b4,
        fontWeight: vars.typography.fontWeight[600],
        padding: "0 0.5rem",
        gap: "0.5rem",
        height: "1.5rem",
      },
      sm: {
        ...classes.typography.body.b3,
        fontWeight: vars.typography.fontWeight[600],
        padding: "0 0.75rem",
        gap: "0.5rem ",
        height: "2rem",
      },
      md: {
        ...classes.typography.body.b2,
        fontWeight: vars.typography.fontWeight[600],
        padding: "0 1rem",
        gap: "0.5rem",
        height: "2.5rem",
      },
      lg: {
        ...classes.typography.body.b1,
        fontWeight: vars.typography.fontWeight[600],
        padding: "0 1.5rem",
        gap: "0.5rem",
        height: "3rem",
      },
    },
    variant: {
      brand: {
        backgroundColor: enableColorVariant,
        color: vars.colors.$static.light.color.white,

        "&:hover:not([disabled])": {
          backgroundColor: hoverColorVariant,
        },
        "&:active:not([disabled])": {
          backgroundColor: activeColorVariant,
        },
      },
      neutral: {
        border: `1px solid ${enableColorVariant}`,
        color: enableColorVariant,
        backgroundColor: "transparent",

        "&:hover:not([disabled])": {
          backgroundColor: hoverColorVariant,
          color: vars.colors.$static.light.color.white,
        },
        "&:active:not([disabled])": {
          backgroundColor: activeColorVariant,
          color: vars.colors.$static.light.color.white,
        },
      },
    },
  },
});

export const spanStyle = recipe({
  base: {
    display: "flex",
    alignItems: "center",
  },
  variants: {
    size: {
      xs: {
        ...classes.typography.body.b4,
        fontWeight: vars.typography.fontWeight[600],
      },
      sm: {
        ...classes.typography.body.b3,
        fontWeight: vars.typography.fontWeight[600],
      },
      md: {
        ...classes.typography.body.b2,
        fontWeight: vars.typography.fontWeight[600],
      },
      lg: {
        ...classes.typography.body.b1,
        fontWeight: vars.typography.fontWeight[600],
      },
    },
  },
});

const spinKeyframes = keyframes({
  "0%": { transform: "rotate(0deg)" },
  "100%": { transform: "rotate(360deg)" },
});

export const spinnerStyle = recipe({
  base: {
    position: "absolute",
    animation: `${spinKeyframes} 0.45s linear infinite`,
    display: "inline-block",
    borderTop: "2px solid currentcolor",
    borderRight: "2px solid currentcolor",
    borderBottom: "2px solid transparent",
    borderLeft: "2px solid transparent",
    borderRadius: "50%",
  },
  variants: {
    size: {
      xs: {
        width: vars.typography.fontSize[11],
        height: vars.typography.fontSize[11],
        left: `calc(50% - ${vars.typography.fontSize[11]}/2)`,
      },
      sm: {
        width: vars.typography.fontSize[12],
        height: vars.typography.fontSize[12],
        left: `calc(50% - ${vars.typography.fontSize[12]}/2)`,
      },
      md: {
        width: vars.typography.fontSize[13],
        height: vars.typography.fontSize[13],
        left: `calc(50% - ${vars.typography.fontSize[13]}/2)`,
      },
      lg: {
        width: vars.typography.fontSize[15],
        height: vars.typography.fontSize[15],
        left: `calc(50% - ${vars.typography.fontSize[15]}/2)`,
      },
    },
  },
});
