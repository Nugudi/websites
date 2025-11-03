import { classes, vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

export const tabsContainerStyle = style({
  width: "100%",
  WebkitTapHighlightColor: "transparent",
  overflowX: "hidden",
});

export const tabListWrapper = style({
  position: "sticky",
  top: 0,
  backgroundColor: vars.colors.$static.light.color.white,
  zIndex: 100,
  width: "100%",
  borderBottom: `1px solid ${vars.colors.$scale.zinc[200]}`,
  overflowX: "hidden",
});

export const tabListStyle = recipe({
  base: {
    display: "flex",
    width: "100%",
    overflowX: "hidden",
  },
});

export const tabStyle = recipe({
  base: {
    padding: "16px",
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
    isActive: {
      true: {
        color: vars.colors.$scale.zinc[600],
        fontWeight: vars.typography.fontWeight[600],
        borderBottom: `2px solid ${vars.colors.$scale.zinc[600]}`,
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

export const tabPanelStyle = style({
  padding: "8px 16px",
  width: "100%",
  flexShrink: 0,
  boxSizing: "border-box",
});
