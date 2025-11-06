/**
 * Cafeteria Review Domain Entity
 * Entity: camelCase | DTO: snake_case
 */

import { z } from "zod";
import { MealTypeSchema } from "./cafeteria-menu.entity";

/** 리뷰 Entity */
export const ReviewSchema = z.object({
  id: z.number().int().positive(),
  restaurantId: z.number().int().positive(),
  reviewDate: z.string(),
  mealType: MealTypeSchema,
  tasteTypeId: z.number().int().positive(),
  content: z.string().min(1),
  mainImageUrl: z.string().nullable(),
  likeCount: z.number().int().min(0),
  createdAt: z.string().datetime(),
});

export type Review = z.infer<typeof ReviewSchema>;

/** 리뷰 작성 요청 */
export const CreateReviewRequestSchema = z.object({
  restaurantId: z.number().int().positive(),
  reviewDate: z.string(),
  mealType: MealTypeSchema,
  tasteTypeId: z.number().int().positive(),
  content: z.string().min(1),
  mainImageFileId: z.number().int().nullable().optional(),
});

export type CreateReviewRequest = z.infer<typeof CreateReviewRequestSchema>;
