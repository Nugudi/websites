import { vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";

export const container = style({
  background: vars.colors.$scale.zinc[50],
  width: "100%",
  minHeight: "100vh",
  boxSizing: "border-box",
  padding: vars.box.spacing[4], // 16px
  paddingBottom: "100px", // TODO: Design Token에 해당하는 값 없음
});
