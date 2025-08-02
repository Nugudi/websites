import { classes, vars } from "@nugudi/themes";
import { keyframes, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

export const tabsContainerStyle = style({
  width: "100%",
  WebkitTapHighlightColor: "transparent",
});

export const tabListStyle = recipe({
  base: {
    display: "flex",
    position: "relative",
  },
});

export const tabStyle = recipe({
  base: {
    padding: "12px 16px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
    whiteSpace: "nowrap",
    outline: "none",
    ...classes.typography.body.b3,
    color: vars.colors.$scale.zinc[400],
    borderBottom: `2px solid transparent`,
    flex: 1,
    textAlign: "center",
    transform: "translateX(0)",

    // 모바일 터치 하이라이트 제거
    WebkitTapHighlightColor: "transparent",
    WebkitTouchCallout: "none",
    WebkitUserSelect: "none",
    userSelect: "none",

    // 모바일에서 버튼 스타일 제거
    WebkitAppearance: "none",
    appearance: "none",

    ":hover": {
      color: vars.colors.$scale.zinc[500],
    },
  },
  variants: {
    size: {
      full: {
        padding: "0.75rem",
      },
    },
    isActive: {
      true: {
        color: vars.colors.$scale.zinc[600],
        fontWeight: vars.typography.fontWeight[600],
        borderBottom: `2px solid ${vars.colors.$scale.zinc[600]}`,
        transform: "translateX(0) scale(1.02)",
      },
    },
    disabled: {
      true: {
        cursor: "not-allowed",
        color: vars.colors.$scale.zinc[400],
        ":hover": {
          color: vars.colors.$scale.zinc[400],
        },
      },
    },
  },
});

const tabPanelFadeIn = keyframes({
  "0%": {
    opacity: 0,
    transform: "translateY(8px)",
  },
  "100%": {
    opacity: 1,
    transform: "translateY(0)",
  },
});

export const tabPanelStyle = style({
  padding: "8px 16px",
  animation: `${tabPanelFadeIn} 0.2s ease-out forwards`,
});
