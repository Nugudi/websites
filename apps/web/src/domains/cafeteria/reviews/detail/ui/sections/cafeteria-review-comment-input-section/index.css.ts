import { vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";

export const inputWrapper = style({
  flexShrink: 0,
  boxSizing: "border-box",
});

export const buttonBox = style({
  pointerEvents: "auto",
  cursor: "pointer",
  border: "none",
  background: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  selectors: {
    "&:disabled": {
      cursor: "not-allowed",
    },
  },
});

export const activeIcon = style({
  color: vars.colors.$scale.main[500],
  transition: "color 0.2s",
});

export const disabledIcon = style({
  color: vars.colors.$scale.zinc[300],
  transition: "color 0.2s",
});
