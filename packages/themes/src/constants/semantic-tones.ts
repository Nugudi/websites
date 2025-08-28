/**
 * 디자인 시스템 전체에서 사용되는 시맨틱 컬러 톤
 * 특정 색상이 아닌 UI 요소의 의도/의미를 나타냄
 */
export const SemanticTones = {
  Neutral: "neutral",
  Informative: "informative",
  Positive: "positive",
  Warning: "warning",
  Negative: "negative",
  Purple: "purple",
} as const;

export type SemanticTone = (typeof SemanticTones)[keyof typeof SemanticTones];

/**
 * 컴포넌트 스타일링을 위한 시맨틱 변형
 */
export const SemanticVariants = {
  Solid: "solid",
  Weak: "weak",
  Outline: "outline",
} as const;

export type SemanticVariant =
  (typeof SemanticVariants)[keyof typeof SemanticVariants];
