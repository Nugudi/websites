import { classes, vars } from "@nugudi/themes";
import { recipe } from "@vanilla-extract/recipes";

export const containerStyle = recipe({
  base: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    position: "relative",
  },
});

export const labelStyle = recipe({
  base: {
    color: vars.colors.$scale.zinc[500],
    ...classes.typography.emphasis.e2,
    transition: "color 0.2s",
  },
  variants: {
    isError: {
      true: {
        color: vars.colors.$static.light.color.red,
      },
    },
    isFocused: {
      true: {
        color: vars.colors.$scale.main[500],
      },
    },
  },
});

export const inputStyle = recipe({
  base: {
    margin: 0,
    padding: 0,
    border: 0,
    background: "none",
    width: "100%",
    outline: "none",
    transition: "border-color 0.2s, background-color 0.2s",
    color: vars.colors.$scale.zinc[800],
    boxSizing: "border-box",
    selectors: {
      "&::placeholder": {
        color: vars.colors.$scale.zinc[300],
      },
      "&:disabled": {
        cursor: "not-allowed",
        opacity: 0.4,
      },
      "&:-webkit-autofill": {
        WebkitBoxShadow: "0 0 0 30px #fff inset",
        WebkitTextFillColor: vars.colors.$scale.zinc[800],
      },
      "&:-webkit-autofill:hover, &:-webkit-autofill:focus, &:-webkit-autofill:active":
        {
          transition: "background-color 5000s ease-in-out 0s",
        },
    },
  },
  variants: {
    size: {
      full: {
        ...classes.typography.body.b1,
        height: "2.625rem",
      },
    },
    variant: {
      default: {
        borderBottom: `2px solid ${vars.colors.$scale.zinc[500]}`,
        backgroundColor: "transparent",
        selectors: {
          "&:focus:not(:disabled)": {
            borderColor: vars.colors.$scale.main[500],
          },
        },
      },
      filled: {
        borderRadius: vars.box.radii.xl,
        backgroundColor: vars.colors.$scale.zinc[100],
        height: "3.125rem",
        padding: "0 1rem",
      },
    },
    isError: {
      true: {
        borderColor: vars.colors.$static.light.color.red,
        color: vars.colors.$static.light.color.red,
        selectors: {
          "&:focus:not(:disabled)": {
            borderColor: vars.colors.$static.light.color.red,
          },
        },
      },
    },
  },
  compoundVariants: [
    {
      variants: {
        variant: "filled",
        isError: true,
      },
      style: {
        backgroundColor: `${vars.colors.$static.light.color.red}1A`,
      },
    },
  ],
});

export const errorMessageStyle = recipe({
  base: {
    ...classes.typography.emphasis.e2,
    color: vars.colors.$static.light.color.red,
    marginTop: "0.25rem",
  },
});
