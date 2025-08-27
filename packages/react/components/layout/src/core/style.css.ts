import { vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";
import { createSprinkles, defineProperties } from "@vanilla-extract/sprinkles";

export const BaseStyle = style({
  padding: 0,
  margin: 0,

  // @ts-ignore
  "&:focus-visible": {
    outline: "none",

    boxShadow: vars.box.shadows.outline,
  },
});

const HeightAndWidthProperties = defineProperties({
  properties: {
    height: {
      ...vars.box.spacing,
      auto: "auto",
      full: "100%",
      screen: "100vh",
      min: "min-content",
      max: "max-content",
      fit: "fit-content",
    },
    width: {
      ...vars.box.spacing,
      auto: "auto",
      full: "100%",
      screen: "100vw",
      min: "min-content",
      max: "max-content",
      fit: "fit-content",
    },
    maxWidth: {
      ...vars.box.spacing,
      auto: "auto",
      full: "100%",
      screen: "100vw",
      min: "min-content",
      max: "max-content",
      fit: "fit-content",
      none: "none",
    },
    minWidth: {
      ...vars.box.spacing,
      auto: "auto",
      full: "100%",
      screen: "100vw",
      min: "min-content",
      max: "max-content",
      fit: "fit-content",
    },
    maxHeight: {
      ...vars.box.spacing,
      auto: "auto",
      full: "100%",
      screen: "100vh",
      min: "min-content",
      max: "max-content",
      fit: "fit-content",
      none: "none",
    },
    minHeight: {
      ...vars.box.spacing,
      auto: "auto",
      full: "100%",
      screen: "100vh",
      min: "min-content",
      max: "max-content",
      fit: "fit-content",
    },
  },
  shorthands: {
    w: ["width"],
    h: ["height"],
    maxW: ["maxWidth"],
    minW: ["minWidth"],
    maxH: ["maxHeight"],
    minH: ["minHeight"],
    size: ["width", "height"],
    maxSize: ["maxWidth", "maxHeight"],
    minSize: ["minWidth", "minHeight"],
    sizeX: ["width", "minWidth", "maxWidth"],
    sizeY: ["height", "minHeight", "maxHeight"],
  },
});

const MarginAndPaddingProperties = defineProperties({
  properties: {
    margin: {
      ...vars.box.spacing,
      auto: "auto",
    },
    padding: {
      ...vars.box.spacing,
    },
    marginTop: {
      ...vars.box.spacing,
      auto: "auto",
    },
    marginRight: {
      ...vars.box.spacing,
      auto: "auto",
    },
    marginBottom: {
      ...vars.box.spacing,
      auto: "auto",
    },
    marginLeft: {
      ...vars.box.spacing,
      auto: "auto",
    },
    paddingTop: {
      ...vars.box.spacing,
    },
    paddingRight: {
      ...vars.box.spacing,
    },
    paddingBottom: {
      ...vars.box.spacing,
    },
    paddingLeft: {
      ...vars.box.spacing,
    },
  },
  shorthands: {
    m: ["marginTop", "marginRight", "marginBottom", "marginLeft"],
    p: ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"],
    ml: ["marginLeft"],
    mr: ["marginRight"],
    mt: ["marginTop"],
    mb: ["marginBottom"],
    pl: ["paddingLeft"],
    pr: ["paddingRight"],
    pt: ["paddingTop"],
    pb: ["paddingBottom"],
    mX: ["marginLeft", "marginRight"],
    mY: ["marginTop", "marginBottom"],
    pX: ["paddingLeft", "paddingRight"],
    pY: ["paddingTop", "paddingBottom"],
  },
});

const BorderStyleProperties = defineProperties({
  properties: {
    borderRadius: vars.box.radii,
  },
});

const BoxShadowStyleProps = defineProperties({
  properties: {
    boxShadow: vars.box.shadows,
  },
});

export const StyleSprinkles = createSprinkles(
  HeightAndWidthProperties,
  MarginAndPaddingProperties,
  BorderStyleProperties,
  BoxShadowStyleProps,
);
