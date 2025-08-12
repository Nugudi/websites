import { createVar } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

export const activeColorVariant = createVar();
export const inactiveColorVariant = createVar();

export const containerStyle = recipe({
  base: {
    display: "flex",
    alignItems: "center",
  },
  variants: {
    size: {
      sm: {
        gap: "8px",
      },
      md: {
        gap: "10px",
      },
      lg: {
        gap: "12px",
      },
    },
  },
});

export const stepStyle = recipe({
  base: {
    borderRadius: "9999px",
    transition: "all 0.2s ease-in-out",
  },
  variants: {
    size: {
      sm: {
        height: "8px",
        minWidth: "8px",
      },
      md: {
        height: "10px",
        minWidth: "10px",
      },
      lg: {
        height: "12px",
        minWidth: "12px",
      },
    },
    state: {
      active: {
        backgroundColor: activeColorVariant,
        width: "40px",
      },
      inactive: {
        backgroundColor: inactiveColorVariant,
        width: "10px",
      },
    },
  },
  compoundVariants: [
    {
      variants: {
        size: "sm",
        state: "active",
      },
      style: {
        width: "32px",
      },
    },
    {
      variants: {
        size: "sm",
        state: "inactive",
      },
      style: {
        width: "8px",
      },
    },
    {
      variants: {
        size: "lg",
        state: "active",
      },
      style: {
        width: "48px",
      },
    },
    {
      variants: {
        size: "lg",
        state: "inactive",
      },
      style: {
        width: "12px",
      },
    },
  ],
});
