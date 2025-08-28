import { type ColorShade, classes, vars } from "@nugudi/themes";
import type { ComplexStyleRule } from "@vanilla-extract/css";
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

// ColorScale 타입 정의 - 실제 vars.colors.$scale의 타입과 매칭
type ColorScale = Record<ColorShade, string>;

interface ToneVariantOptions {
  solidBg?: ColorShade;
  solidColor?: string;
  weakBg?: ColorShade;
  weakColor?: ColorShade;
  outlineBorder?: ColorShade;
  outlineColor?: ColorShade;
}

interface ToneVariants {
  solid: ComplexStyleRule;
  weak: ComplexStyleRule;
  outline: ComplexStyleRule;
}

const createToneVariants = (
  colorScale: ColorScale,
  options?: ToneVariantOptions,
): ToneVariants => {
  const {
    solidBg = 600,
    solidColor = vars.colors.$static.light.color.white,
    weakBg = 100,
    weakColor = 700,
    outlineBorder = 300,
    outlineColor = 600,
  } = options || {};

  return {
    solid: {
      backgroundColor: colorScale[solidBg],
      color: solidColor,
      fontWeight: vars.typography.fontWeight[600],
    },
    weak: {
      backgroundColor: colorScale[weakBg],
      color: colorScale[weakColor],
    },
    outline: {
      backgroundColor: "transparent",
      color: colorScale[outlineColor],
      border: `1px solid ${colorScale[outlineBorder]}`,
      fontWeight: vars.typography.fontWeight[600],
    },
  };
};

const toneVariants = {
  neutral: createToneVariants(vars.colors.$scale.zinc, {
    solidBg: 700,
    weakColor: 700,
    outlineColor: 700,
  }),
  informative: createToneVariants(vars.colors.$scale.blue, {
    solidBg: 600,
    weakBg: 100,
    weakColor: 600,
    outlineBorder: 200,
  }),
  positive: createToneVariants(vars.colors.$scale.main, {
    solidBg: 600,
    weakBg: 100,
    weakColor: 700,
    outlineBorder: 200,
  }),
  warning: createToneVariants(vars.colors.$scale.yellow, {
    solidBg: 600,
    weakBg: 100,
    weakColor: 700,
    outlineBorder: 200,
  }),
  negative: createToneVariants(vars.colors.$scale.red, {
    solidBg: 600,
    weakBg: 100,
    weakColor: 600,
    outlineBorder: 200,
  }),
  purple: createToneVariants(vars.colors.$scale.purple, {
    solidBg: 600,
    weakBg: 100,
    weakColor: 600,
    outlineBorder: 200,
  }),
};

// 모든 tone-variant 조합을 자동으로 생성
type BadgeToneVariantKey = `${keyof typeof toneVariants}-${keyof ToneVariants}`;

export const badgeToneVariant = styleVariants(
  Object.entries(toneVariants).reduce<
    Record<BadgeToneVariantKey, ComplexStyleRule>
  >(
    (acc, [tone, variants]) => {
      Object.entries(variants).forEach(([variant, styles]) => {
        const key = `${tone}-${variant}` as BadgeToneVariantKey;
        acc[key] = styles;
      });
      return acc;
    },
    {} as Record<BadgeToneVariantKey, ComplexStyleRule>,
  ),
);
