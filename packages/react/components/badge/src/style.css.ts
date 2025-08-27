import { classes, vars } from "@nugudi/themes";
import { style, styleVariants } from "@vanilla-extract/css";

export const badgeBase = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: vars.box.radii.lg,
  whiteSpace: "nowrap",
  verticalAlign: "middle",
  lineHeight: 1,
  gap: vars.box.spacing[2],
  padding: `${vars.box.spacing[2]} ${vars.box.spacing[4]}`,
});

export const badgeIcon = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
});

export const badgeText = style({
  display: "inline-block",
});

export const badgeSize = styleVariants({
  sm: {
    ...classes.typography.emphasis.e2,
  },
  md: {
    ...classes.typography.body.b4,
  },
  lg: {
    ...classes.typography.body.b3,
  },
});

export const badgeToneVariant = styleVariants({
  // Neutral tone
  "neutral-solid": {
    backgroundColor: vars.colors.$scale.zinc[700],
    color: vars.colors.$static.light.color.white,
    fontWeight: vars.typography.fontWeight[600],
  },
  "neutral-weak": {
    backgroundColor: vars.colors.$scale.zinc[100],
    color: vars.colors.$scale.zinc[700],
  },
  "neutral-outline": {
    backgroundColor: "transparent",
    color: vars.colors.$scale.zinc[700],
    border: `1px solid ${vars.colors.$scale.zinc[300]}`,
    fontWeight: vars.typography.fontWeight[600],
  },

  // Informative tone (blue-like)
  "informative-solid": {
    backgroundColor: vars.colors.$static.light.color.blue,
    color: vars.colors.$static.light.color.white,
    fontWeight: vars.typography.fontWeight[600],
  },
  "informative-weak": {
    backgroundColor: vars.colors.$static.light.color.lightBlue,
    color: vars.colors.$static.light.color.blue,
    border: "1px solid transparent",
  },
  "informative-outline": {
    backgroundColor: "transparent",
    color: vars.colors.$static.light.color.blue,
    border: `1px solid ${vars.colors.$static.light.color.lightBlue}`,
    fontWeight: vars.typography.fontWeight[600],
  },

  // Positive tone (green-like, using main colors)
  "positive-solid": {
    backgroundColor: vars.colors.$scale.main[700],
    color: vars.colors.$static.light.color.white,
    fontWeight: vars.typography.fontWeight[600],
  },
  "positive-weak": {
    backgroundColor: vars.colors.$scale.main[100],
    color: vars.colors.$scale.main[700],
  },
  "positive-outline": {
    backgroundColor: "transparent",
    color: vars.colors.$scale.main[600],
    fontWeight: vars.typography.fontWeight[600],
    border: `1px solid ${vars.colors.$scale.main[100]}`,
  },

  // Negative tone (red-like, using static red)
  "negative-solid": {
    backgroundColor: vars.colors.$static.light.color.red,
    color: vars.colors.$static.light.color.white,
    fontWeight: vars.typography.fontWeight[600],
    border: "1px solid transparent",
  },
  "negative-weak": {
    backgroundColor: vars.colors.$static.light.color.lightRed,
    color: vars.colors.$static.light.color.red,
    border: "1px solid transparent",
  },
  "negative-outline": {
    backgroundColor: vars.colors.$static.light.color.white,
    color: vars.colors.$static.light.color.red,
    fontWeight: vars.typography.fontWeight[600],
    border: `1px solid ${vars.colors.$static.light.color.lightRed}`,
  },
});
