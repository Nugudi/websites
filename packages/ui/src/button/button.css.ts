import { vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

export const buttonBase = style({
  display: "inline-flex",
  cursor: "pointer",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: vars.box.radii.xl,
  border: "none",
  fontWeight: vars.typography.fontWeight[600],
  fontSize: vars.typography.fontSize[15],
  transition: "all 0.5s ease",
  ":disabled": {
    cursor: "not-allowed",
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
          backgroundColor: vars.colors.$scale.zinc[50],
          color: vars.colors.$scale.zinc[200],
        },
        selectors: {
          "&:hover:not(:disabled)": {
            backgroundColor: vars.colors.$scale.main[600],
          },
          ".theme-dark &:disabled": {
            backgroundColor: vars.colors.$scale.zinc[50],
            color: vars.colors.$scale.zinc[200],
          },
        },
      },
      neutral: {
        backgroundColor: vars.colors.$scale.zinc[700],
        color: vars.colors.$scale.system.white,
        ":disabled": {
          backgroundColor: vars.colors.$scale.zinc[50],
          color: vars.colors.$scale.zinc[200],
        },
        selectors: {
          "&:hover:not(:disabled)": {
            backgroundColor: vars.colors.$scale.zinc[800],
          },
          ".theme-dark &:disabled": {
            backgroundColor: vars.colors.$scale.zinc[50],
            color: vars.colors.$scale.zinc[200],
          },
        },
      },
    },
    size: {
      sm: {
        height: vars.box.spacing[10],
        paddingLeft: vars.box.spacing[4],
        paddingRight: vars.box.spacing[4],
      },
      md: {
        height: vars.box.spacing[12],
        paddingLeft: vars.box.spacing[5],
        paddingRight: vars.box.spacing[5],
      },
      lg: {
        height: vars.box.spacing[14],
        paddingLeft: vars.box.spacing[6],
        paddingRight: vars.box.spacing[6],
      },
      full: {
        height: vars.box.spacing[14],
        width: "100%",
        paddingLeft: vars.box.spacing[6],
        paddingRight: vars.box.spacing[6],
      },
    },
  },
  defaultVariants: {
    variant: "brand",
    size: "full",
  },
});
