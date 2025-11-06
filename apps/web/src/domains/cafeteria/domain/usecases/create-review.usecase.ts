/**
 * Create Review UseCase
 *
 * 리뷰를 작성하는 비즈니스 로직
 */

import type { CreateReviewRequest, CreateReviewResponse } from "../../data/dto";
import type { CafeteriaReviewRepository } from "../repositories";

/**
 * Create Review UseCase
 */
export interface CreateReviewUseCase {
  execute(data: CreateReviewRequest): Promise<CreateReviewResponse>;
}

/**
 * Create Review UseCase Implementation
 */
export class CreateReviewUseCaseImpl implements CreateReviewUseCase {
  constructor(private readonly repository: CafeteriaReviewRepository) {}

  /**
   * UseCase 실행
   */
  async execute(data: CreateReviewRequest): Promise<CreateReviewResponse> {
    // Validate required fields
    if (!data.restaurantId) {
      throw new Error("Restaurant ID is required");
    }
    if (!data.reviewDate) {
      throw new Error("Review date is required");
    }
    if (!data.tasteTypeId) {
      throw new Error("Taste type is required");
    }

    return this.repository.createReview(data);
  }
}
