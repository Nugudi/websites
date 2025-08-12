import { classes, vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

export const containerStyle = style({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  width: "100%",
});

export const inputContainerStyle = style({
  display: "flex",
  gap: "8px",
});

export const otpInputStyle = recipe({
  base: {
    width: "45px",
    height: "55px",
    textAlign: "center",
    borderRadius: vars.box.radii.xl,
    backgroundColor: vars.colors.$scale.zinc[50],
    transition: "all 0.2s ease",
    outline: "none",
    border: "none",
    boxSizing: "border-box",
    WebkitAppearance: "none",
    WebkitTextSizeAdjust: "100%",
    caretColor: vars.colors.$scale.zinc[300],
    ...classes.typography.title.t1,
    fontWeight: vars.typography.fontWeight[600],
    ":disabled": {
      opacity: 0.5,
      cursor: "not-allowed",
    },
  },

  variants: {
    isError: {
      true: {
        backgroundColor: `${vars.colors.$static.light.color.red}1A`,
        color: vars.colors.$static.light.color.red,
      },
    },
    isFilled: {
      true: {
        backgroundColor: vars.colors.$scale.zinc[100],
      },
    },
  },
  compoundVariants: [
    {
      variants: {
        isError: true,
        isFilled: true,
      },
      style: {
        backgroundColor: `${vars.colors.$static.light.color.red}1A`,
      },
    },
  ],
});

export const errorMessageStyle = style({
  ...classes.typography.emphasis.e2,
  color: vars.colors.$static.light.color.red,
});
