import type { RatingOption } from "../types/review-rating";

export const RATING_OPTIONS: RatingOption[] = [
  { value: "good" as const, label: "맛있어요", emoji: "😊" },
  { value: "soso" as const, label: "싱거워요", emoji: "😐" },
  { value: "bad" as const, label: "짜요", emoji: "😣" },
  { value: "angry" as const, label: "매워요", emoji: "🔥" },
];
