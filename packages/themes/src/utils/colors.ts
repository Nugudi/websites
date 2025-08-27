import { COLOR_SHADES, type ColorShade } from "../constants/color";

export type ColorPalette = Record<ColorShade, string>;
export type StaticColorPalette = Record<ColorShade, string>;

/**
 * 색상 팔레트 생성 유틸리티
 * CSS 변수명을 자동으로 생성하여 색상 스케일 객체 반환
 * @param colorName - CSS 변수 이름에 사용될 색상명
 * @returns CSS 변수 형태의 색상 팔레트
 * @example createColorScale("blue") // { 50: "var(--blue-50)", ... }
 */
export const createColorScale = (colorName: string): ColorPalette => {
  return COLOR_SHADES.reduce(
    (acc, shade) => {
      acc[shade] = `var(--${colorName}-${shade})`;
      return acc;
    },
    {} as Record<ColorShade, string>,
  );
};

/**
 * 색상 팔레트의 순서를 반전시킵니다.
 * 다크 모드에서 사용: 50 ↔ 900, 100 ↔ 800, ... 형태로 변환
 * @param palette - 반전시킬 색상 팔레트
 * @returns 순서가 반전된 색상 팔레트
 * @example reversePalette({ 50: "#fff", ..., 900: "#000" }) // { 50: "#000", ..., 900: "#fff" }
 */
export const reversePalette = (
  palette: StaticColorPalette,
): StaticColorPalette => {
  const shades = [...COLOR_SHADES];
  const reversedShades = [...shades].reverse();

  return shades.reduce((acc, shade, index) => {
    acc[shade] = palette[reversedShades[index]];
    return acc;
  }, {} as StaticColorPalette);
};
