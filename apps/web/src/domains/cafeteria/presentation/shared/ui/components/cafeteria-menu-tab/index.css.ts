import { vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";

export const timelineWrapper = style({
  position: "relative",
});

export const timelineContainer = style({
  position: "relative",
});

export const timelineItem = style({
  position: "relative",
  zIndex: 1,
});

export const timelineLine = style({
  position: "absolute",
  left: "6px",
  top: "26px",
  width: "2px",
  height: "calc(100% - 34px)", // 위아래 모두 간격
  backgroundColor: vars.colors.$scale.main[200],
  zIndex: 0,
});

export const circle = style({
  width: "12px",
  height: "12px",
  borderRadius: "50%",
  backgroundColor: vars.colors.$scale.main[100],
  border: `2px solid ${vars.colors.$scale.main[200]}`,
  position: "relative",
  top: "6px",
  zIndex: 2,
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "::after": {
    content: '""',
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: vars.colors.$scale.main[400],
  },
});

export const reviewPromptCard = style({
  position: "relative",
  overflow: "hidden",
  width: "100%",
  maxWidth: "100%",
});

export const buttonBox = style({
  position: "relative",
  width: "100%",
  maxWidth: "100%",
});

export const characterImageBox = style({
  position: "absolute",
  top: -60,
  right: 16,
  zIndex: 1,
  maxWidth: "80px",
});

export const writeReviewButton = style({
  position: "relative",
  zIndex: 2,
  maxWidth: "100%",
});
