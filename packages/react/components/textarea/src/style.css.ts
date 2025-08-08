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
    marginBottom: "0.25rem",
    marginLeft: "0.25rem",
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

export const textareaStyle = recipe({
  base: {
    margin: 0,
    border: 0,
    width: "100%",
    outline: "none",
    transition: "background-color 0.2s",
    color: vars.colors.$scale.zinc[800],
    boxSizing: "border-box",
    resize: "vertical",
    minHeight: "6rem",
    borderRadius: vars.box.radii.xl,
    backgroundColor: vars.colors.$scale.zinc[100],
    padding: "1rem",
    ...classes.typography.body.b3,
    selectors: {
      "&::placeholder": {
        color: vars.colors.$scale.zinc[400],
      },
      "&:disabled": {
        cursor: "not-allowed",
        opacity: 0.4,
      },
      "&:-webkit-autofill": {
        WebkitBoxShadow: `0 0 0 30px ${vars.colors.$static.light.color.white} inset`,
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
        width: "100%",
      },
    },
    isError: {
      true: {
        backgroundColor: `${vars.colors.$static.light.color.red}1A`,
        color: vars.colors.$static.light.color.red,
      },
    },
    resize: {
      none: {
        resize: "none",
      },
      vertical: {
        resize: "vertical",
      },
      horizontal: {
        resize: "horizontal",
      },
      both: {
        resize: "both",
      },
    },
  },
});

export const errorMessageStyle = recipe({
  base: {
    ...classes.typography.emphasis.e2,
    color: vars.colors.$static.light.color.red,
    marginTop: "0.25rem",
    marginLeft: "0.25rem",
  },
});
