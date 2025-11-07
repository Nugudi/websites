/**
 * Cafeteria Review Entity
 */

import type { MealType } from "./cafeteria-menu.entity";

/** 리뷰 Entity */
export interface Review {
  readonly id: number;
  readonly restaurantId: number;
  readonly reviewDate: string;
  readonly mealType: MealType;
  readonly tasteTypeId: number;
  readonly content: string;
  readonly mainImageUrl: string | null;
  readonly likeCount: number;
  readonly createdAt: string;
}

/** 리뷰 작성 요청 */
export interface CreateReviewRequest {
  readonly restaurantId: number;
  readonly reviewDate: string;
  readonly mealType: MealType;
  readonly tasteTypeId: number;
  readonly content: string;
  readonly mainImageFileId?: number | null;
}
