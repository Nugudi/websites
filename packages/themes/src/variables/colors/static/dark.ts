import { reversePalette } from "../../../utils/colors";
import {
  blackAlphaPalette,
  bluePalette,
  mainPalette,
  purplePalette,
  redPalette,
  whiteAlphaPalette,
  yellowPalette,
  zincPalette,
} from "./palettes";

export const main = reversePalette(mainPalette);
export const zinc = reversePalette(zincPalette);
export const yellow = reversePalette(yellowPalette);
export const blue = reversePalette(bluePalette);
export const purple = reversePalette(purplePalette);
export const red = reversePalette(redPalette);

export const whiteAlpha = reversePalette(whiteAlphaPalette);
export const blackAlpha = reversePalette(blackAlphaPalette);

export const color = {
  black: "#121212",
  white: "#FFFFFF",
  red: "#F44336",
  backdrop: "rgba(0, 0, 0, 0.6)",
};

export const gradient = {
  linearGreen: "linear-gradient(180deg, #1A2A1A 0%, #272729 29.81%)",
};
