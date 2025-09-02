export const ratingOptions = ["good", "soso", "bad", "angry"] as const;
export type ReviewRating = (typeof ratingOptions)[number];

export interface RatingOption {
  value: ReviewRating;
  label: string;
  emoji: string;
}
