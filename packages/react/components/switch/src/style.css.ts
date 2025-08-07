import { vars } from "@nugudi/themes";
import { createVar } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

export const backgroundColorVariant = createVar();
export const thumbColorVariant = createVar();

export const switchContainer = recipe({
  base: {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    border: "none",
    background: "transparent",
    padding: 0,
    cursor: "pointer",
    transition: "opacity 0.2s",
    ":focus": {
      outline: "none",
    },
    ":focus-visible": {
      outline: "2px solid",
      outlineColor: backgroundColorVariant,
      outlineOffset: "2px",
      borderRadius: "9999px",
    },
  },
  variants: {
    size: {
      sm: {
        width: "32px",
        height: "16px",
      },
      md: {
        width: "44px",
        height: "24px",
      },
      lg: {
        width: "56px",
        height: "32px",
      },
    },
    isDisabled: {
      true: {
        opacity: 0.4,
        cursor: "not-allowed",
      },
    },
  },
  defaultVariants: {
    size: "md",
    isDisabled: false,
  },
});

export const switchTrack = recipe({
  base: {
    position: "relative",
    width: "100%",
    height: "100%",
    backgroundColor: backgroundColorVariant,
    borderRadius: "9999px",
    transition: "background-color 0.2s",
  },
  variants: {
    size: {
      sm: {},
      md: {},
      lg: {},
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export const switchThumb = recipe({
  base: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    backgroundColor: thumbColorVariant,
    borderRadius: "50%",
    transition: "transform 0.2s",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
  },
  variants: {
    size: {
      sm: {
        width: "12px",
        height: "12px",
        left: "2px",
      },
      md: {
        width: "18px",
        height: "18px",
        left: "3px",
      },
      lg: {
        width: "26px",
        height: "26px",
        left: "3px",
      },
    },
    isSelected: {
      true: {},
      false: {},
    },
  },
  compoundVariants: [
    {
      variants: {
        size: "sm",
        isSelected: true,
      },
      style: {
        transform: "translateY(-50%) translateX(16px)",
      },
    },
    {
      variants: {
        size: "md",
        isSelected: true,
      },
      style: {
        transform: "translateY(-50%) translateX(20px)",
      },
    },
    {
      variants: {
        size: "lg",
        isSelected: true,
      },
      style: {
        transform: "translateY(-50%) translateX(24px)",
      },
    },
  ],
  defaultVariants: {
    size: "md",
    isSelected: false,
  },
});

export const labelWrapper = recipe({
  base: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.75rem",
    cursor: "pointer",
    userSelect: "none",
  },
  variants: {
    labelPlacement: {
      start: {
        flexDirection: "row",
      },
      end: {
        flexDirection: "row",
      },
    },
  },
  defaultVariants: {
    labelPlacement: "end",
  },
});

export const labelText = recipe({
  base: {
    color: vars.colors.$scale.zinc[700],
  },
  variants: {
    size: {
      sm: {
        fontSize: "0.875rem",
      },
      md: {
        fontSize: "1rem",
      },
      lg: {
        fontSize: "1.125rem",
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
});
