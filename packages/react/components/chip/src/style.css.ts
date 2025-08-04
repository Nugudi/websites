import { classes, vars } from "@nugudi/themes";
import { recipe } from "@vanilla-extract/recipes";

export const chipStyle = recipe({
  base: {
    margin: 0,
    padding: 0,
    border: "1px solid",
    borderRadius: vars.box.radii.full,
    display: "inline-flex",
    alignItems: "center",
    cursor: "pointer",
    userSelect: "none",
    transition: "all 0.2s ease-in-out",
    ":hover": {
      transform: "scale(1.02)",
    },
    ":disabled": {
      opacity: 0.4,
      cursor: "not-allowed",
      transform: "none",
    },
  },
  variants: {
    size: {
      sm: {
        ...classes.typography.body.b4,
        padding: "0.375rem 0.75rem",
        gap: "0.25rem",
        height: "1.75rem",
      },
      md: {
        ...classes.typography.body.b4,
        padding: "0.5rem 1rem",
        gap: "0.375rem",
        height: "2rem",
      },
    },
    variant: {
      default: {
        backgroundColor: vars.colors.$scale.zinc[50],
        color: vars.colors.$scale.zinc[500],
        borderColor: "transparent",
      },
      primary: {
        backgroundColor: `color-mix(in srgb, ${vars.colors.$scale.main[500]} 7%, transparent)`,
        color: vars.colors.$scale.main[800],
        borderColor: vars.colors.$scale.main[500],
      },
    },
  },
});

export const iconStyle = recipe({
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  variants: {
    size: {
      sm: {
        width: "0.875rem",
        height: "0.875rem",
      },
      md: {
        width: "1rem",
        height: "1rem",
      },
    },
  },
});
