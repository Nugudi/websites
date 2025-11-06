import { z } from "zod";
import { ratingOptions } from "../types/review-rating";

export const reviewSchema = z.object({
  ratings: z
    .array(z.enum(ratingOptions))
    .min(1, "평가를 최소 1개 이상 선택해주세요"),
  content: z
    .string()
    .trim()
    .min(1, "리뷰 내용을 입력해주세요")
    .max(500, "리뷰는 500자 이내로 작성해주세요"),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;
