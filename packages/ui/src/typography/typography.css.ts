import { classes, vars } from "@nugudi/themes";
import { style, styleVariants } from "@vanilla-extract/css";

export const typographyBase = style({
  margin: 0,
  padding: 0,
});

export const typographySizes = styleVariants({
  h1: classes.typography.heading.h1,
  t1: classes.typography.title.t1,
  t2: classes.typography.title.t2,
  t3: classes.typography.title.t3,
  b1: classes.typography.body.b1,
  b2: classes.typography.body.b2,
  b3: classes.typography.body.b3,
  b3b: classes.typography.body.b3b,
  b4: classes.typography.body.b4,
  b4b: classes.typography.body.b4b,
  e1: classes.typography.emphasis.e1,
  e2: classes.typography.emphasis.e2,
  l1: classes.typography.logo.l1,
  l2: classes.typography.logo.l2,
});

export const typographyColors = styleVariants({
  "main-500": { color: vars.colors.$scale.main[500] },
  "main-800": { color: vars.colors.$scale.main[800] },
  "zinc-50": { color: vars.colors.$scale.zinc[50] },
  "zinc-100": { color: vars.colors.$scale.zinc[100] },
  "zinc-200": { color: vars.colors.$scale.zinc[200] },
  "zinc-300": { color: vars.colors.$scale.zinc[300] },
  "zinc-400": { color: vars.colors.$scale.zinc[400] },
  "zinc-500": { color: vars.colors.$scale.zinc[500] },
  "zinc-600": { color: vars.colors.$scale.zinc[600] },
  "zinc-700": { color: vars.colors.$scale.zinc[700] },
  "zinc-800": { color: vars.colors.$scale.zinc[800] },
  error: { color: vars.colors.$scale.system.error },
  white: { color: vars.colors.$scale.system.white },
  black: { color: vars.colors.$scale.system.black },
});
