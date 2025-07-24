import { vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

export const buttonBase = style({
  display: "inline-flex",
  cursor: "pointer",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: vars.box.radii.lg,
  border: "none",
  fontWeight: vars.typography.fontWeight[600],
  fontSize: vars.typography.fontSize[15],
  transition: "all 0.2s ease",
  ":disabled": {
    cursor: "not-allowed",
    opacity: 0.5,
  },
  selectors: {
    "&:hover:not(:disabled)": {
      transform: "translateY(-1px)",
      boxShadow: vars.box.shadows.md,
    },
    "&:active:not(:disabled)": {
      transform: "translateY(0)",
      boxShadow: vars.box.shadows.sm,
    },
  },
});

export const buttonRecipe = recipe({
  base: buttonBase,
  variants: {
    variant: {
      brand: {
        backgroundColor: vars.colors.$scale.main[500],
        color: vars.colors.$scale.system.white,
        ":disabled": {
          backgroundColor: vars.colors.$scale.zinc[300],
          color: vars.colors.$scale.zinc[500],
        },
        selectors: {
          "&:hover:not(:disabled)": {
            backgroundColor: vars.colors.$scale.main[800],
          },
        },
      },
      neutral: {
        backgroundColor: vars.colors.$scale.zinc[700],
        color: vars.colors.$scale.system.white,
        ":disabled": {
          backgroundColor: vars.colors.$scale.zinc[300],
          color: vars.colors.$scale.zinc[500],
        },
        selectors: {
          "&:hover:not(:disabled)": {
            backgroundColor: vars.colors.$scale.zinc[800],
          },
        },
      },
    },
    size: {
      sm: {
        height: vars.box.spacing[8],
        paddingLeft: vars.box.spacing[4],
        paddingRight: vars.box.spacing[4],
        fontSize: vars.typography.fontSize[13],
      },
      md: {
        height: vars.box.spacing[10],
        paddingLeft: vars.box.spacing[5],
        paddingRight: vars.box.spacing[5],
        fontSize: vars.typography.fontSize[15],
      },
      lg: {
        height: vars.box.spacing[12],
        paddingLeft: vars.box.spacing[6],
        paddingRight: vars.box.spacing[6],
        fontSize: vars.typography.fontSize[16],
      },
      full: {
        height: vars.box.spacing[12],
        width: "100%",
        paddingLeft: vars.box.spacing[6],
        paddingRight: vars.box.spacing[6],
        fontSize: vars.typography.fontSize[16],
      },
    },
  },
  defaultVariants: {
    variant: "brand",
    size: "md",
  },
});
