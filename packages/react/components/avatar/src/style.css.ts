import { classes, vars } from "@nugudi/themes";
import { createVar, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

export const badgeBorderColorVar = createVar();
export const badgeBackgroundColorVar = createVar();

export const avatarContainer = recipe({
  base: {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    verticalAlign: "top",
    flexShrink: 0,
    color: vars.colors.$scale.zinc[200],
    backgroundColor: vars.colors.$scale.zinc[50],
    borderWidth: "0.125rem",
    borderStyle: "solid",
    userSelect: "none",
  },
  variants: {
    size: {
      xs: {
        width: "30px",
        height: "30px",
      },
      sm: {
        width: vars.box.spacing[10],
        height: vars.box.spacing[10],
      },
      md: {
        width: vars.box.spacing[20],
        height: vars.box.spacing[20],
      },
      lg: {
        width: vars.box.spacing[32],
        height: vars.box.spacing[32],
      },
    },
    borderRadius: {
      full: {
        borderRadius: vars.box.radii.full,
      },
      lg: {
        borderRadius: vars.box.radii["3xl"],
      },
      md: {
        borderRadius: vars.box.radii.xl,
      },
      sm: {
        borderRadius: vars.box.radii.base,
      },
      none: {
        borderRadius: vars.box.radii.none,
      },
    },
    showBadge: {
      true: {
        borderColor: badgeBorderColorVar,
      },
      false: {
        borderColor: vars.colors.$scale.zinc[200],
      },
    },
  },
  defaultVariants: {
    size: "md",
    borderRadius: "full",
    showBadge: false,
  },
});

export const avatarInner = recipe({
  base: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
  },
  variants: {
    borderRadius: {
      full: {
        borderRadius: vars.box.radii.full,
      },
      lg: {
        borderRadius: vars.box.radii["3xl"],
      },
      md: {
        borderRadius: vars.box.radii.xl,
      },
      sm: {
        borderRadius: vars.box.radii.base,
      },
      none: {
        borderRadius: vars.box.radii.none,
      },
    },
  },
  defaultVariants: {
    borderRadius: "full",
  },
});

export const avatarImage = style({
  width: "100%",
  height: "100%",
  objectFit: "cover",
});

export const avatarFallback = style({
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const avatarIcon = style({
  width: "70%",
  height: "70%",
  color: vars.colors.$scale.zinc[200],
});

const badgeSizeMap = {
  xs: "9px",
  sm: vars.box.spacing[3],
  md: "1.125rem",
  lg: vars.box.spacing[6],
} as const;

const badgePositionMap = {
  xs: "0px",
  sm: "0.0625rem",
  md: vars.box.spacing[1],
  lg: vars.box.spacing[2],
} as const;

export const avatarBadge = recipe({
  base: {
    position: "absolute",
    display: "block",
    borderRadius: vars.box.radii.full,
    boxSizing: "border-box",
    backgroundColor: badgeBackgroundColorVar,
    zIndex: 1,
  },
  variants: {
    size: {
      xs: {
        width: badgeSizeMap.xs,
        height: badgeSizeMap.xs,
        bottom: badgePositionMap.xs,
        right: badgePositionMap.xs,
      },
      sm: {
        width: badgeSizeMap.sm,
        height: badgeSizeMap.sm,
        bottom: badgePositionMap.sm,
        right: badgePositionMap.sm,
      },
      md: {
        width: badgeSizeMap.md,
        height: badgeSizeMap.md,
        bottom: badgePositionMap.md,
        right: badgePositionMap.md,
      },
      lg: {
        width: badgeSizeMap.lg,
        height: badgeSizeMap.lg,
        bottom: badgePositionMap.lg,
        right: badgePositionMap.lg,
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export const avatarGroup = style({
  display: "inline-flex",
  alignItems: "center",
});

export const avatarGroupItem = recipe({
  base: {
    border: `0.125rem solid white`,
    boxSizing: "border-box",
    selectors: {
      "&:first-child": {
        marginLeft: 0,
      },
    },
  },
  variants: {
    size: {
      xs: {
        marginLeft: "-12px",
      },
      sm: {
        marginLeft: `calc(${vars.box.spacing[4]} * -1)`,
      },
      md: {
        marginLeft: `calc(${vars.box.spacing[6]} * -1)`,
      },
      lg: {
        marginLeft: `calc(${vars.box.spacing[10]} * -1)`,
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export const avatarGroupExcess = recipe({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: vars.colors.$scale.zinc[50],
    color: vars.colors.$scale.zinc[300],
  },
  variants: {
    size: {
      xs: {
        fontSize: "10px",
        fontWeight: "bold",
      },
      sm: {
        ...classes.typography.body.b4b,
      },
      md: {
        ...classes.typography.title.t3,
      },
      lg: {
        ...classes.typography.title.t1,
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
});
