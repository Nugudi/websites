import { vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";

const baseImageContainer = {
  position: "relative" as const,
  width: "100%",
  overflow: "hidden",
  backgroundColor: vars.colors.$scale.zinc[100],
};

export const imageContainer = style({
  ...baseImageContainer,
});

export const imageContainerRounded = style({
  ...baseImageContainer,
  borderRadius: vars.box.radii.xl,
});

export const imageContainerRoundedTop = style({
  ...baseImageContainer,
  borderRadius: `${vars.box.radii.xl} ${vars.box.radii.xl} 0 0`,
});

export const imageWrapper = style({
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  selectors: {
    "& > img": {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block",
    },
  },
});
