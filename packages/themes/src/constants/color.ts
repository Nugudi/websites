export const COLOR_SHADES = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900,
] as const;

export type ColorShade = (typeof COLOR_SHADES)[number];
