import { classes } from "@nugudi/themes";
import { recipe } from "@vanilla-extract/recipes";

export const headingStyle = recipe({
  variants: {
    fontSize: {
      ...classes.typography.heading,
    },
  },
  defaultVariants: {
    fontSize: "h1",
  },
});

export const emphasisStyle = recipe({
  variants: {
    fontSize: {
      ...classes.typography.emphasis,
    },
  },
  defaultVariants: {
    fontSize: "e1",
  },
});

export const titleStyle = recipe({
  variants: {
    fontSize: {
      ...classes.typography.title,
    },
  },
  defaultVariants: {
    fontSize: "t1",
  },
});

export const bodyStyle = recipe({
  variants: {
    fontSize: {
      ...classes.typography.body,
    },
  },
  defaultVariants: {
    fontSize: "b1",
  },
});

export const logoStyle = recipe({
  variants: {
    fontSize: {
      ...classes.typography.logo,
    },
  },
  defaultVariants: {
    fontSize: "l1",
  },
});
