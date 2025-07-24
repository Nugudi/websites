import { vars } from "@nugudi/themes";
import { styleVariants } from "@vanilla-extract/css";

export const colorTokens = styleVariants({
  "main-500": { backgroundColor: vars.colors.$scale.main[500] },
  "main-800": { backgroundColor: vars.colors.$scale.main[800] },
  "zinc-50": { backgroundColor: vars.colors.$scale.zinc[50] },
  "zinc-100": { backgroundColor: vars.colors.$scale.zinc[100] },
  "zinc-200": { backgroundColor: vars.colors.$scale.zinc[200] },
  "zinc-300": { backgroundColor: vars.colors.$scale.zinc[300] },
  "zinc-400": { backgroundColor: vars.colors.$scale.zinc[400] },
  "zinc-500": { backgroundColor: vars.colors.$scale.zinc[500] },
  "zinc-600": { backgroundColor: vars.colors.$scale.zinc[600] },
  "zinc-700": { backgroundColor: vars.colors.$scale.zinc[700] },
  "zinc-800": { backgroundColor: vars.colors.$scale.zinc[800] },
  error: { backgroundColor: vars.colors.$scale.system.error },
  white: { backgroundColor: vars.colors.$scale.system.white },
  black: { backgroundColor: vars.colors.$scale.system.black },
});
