/**
 * Cafeteria Review Validation Schemas
 *
 * Zod schemas for runtime validation of Cafeteria Review data from API
 */

import { z } from "zod";
import { MealTypeSchema } from "./cafeteria-menu.schema";

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

/** 리뷰 작성 요청 */
export const CreateReviewRequestSchema = z.object({
  restaurantId: z.number().int().positive(),
  reviewDate: z.string(),
  mealType: MealTypeSchema,
  tasteTypeId: z.number().int().positive(),
  content: z.string().min(1),
  mainImageFileId: z.number().int().nullable().optional(),
});
