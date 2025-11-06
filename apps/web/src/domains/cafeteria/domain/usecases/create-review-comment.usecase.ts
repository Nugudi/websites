/**
 * Create Review Comment UseCase
 *
 * 리뷰 댓글을 작성하는 비즈니스 로직
 */

import type { CreateReviewCommentRequest, ReviewComment } from "../entities";
import type { CafeteriaReviewRepository } from "../repositories";

/**
 * Create Review Comment UseCase
 */
export interface CreateReviewCommentUseCase {
  execute(
    reviewId: string,
    data: CreateReviewCommentRequest,
  ): Promise<ReviewComment>;
}

/**
 * Create Review Comment UseCase Implementation
 */
export class CreateReviewCommentUseCaseImpl
  implements CreateReviewCommentUseCase
{
  constructor(private readonly repository: CafeteriaReviewRepository) {}

  /**
   * UseCase 실행
   */
  async execute(
    reviewId: string,
    data: CreateReviewCommentRequest,
  ): Promise<ReviewComment> {
    // Validate required fields
    if (!data.content || data.content.trim().length === 0) {
      throw new Error("Comment content is required");
    }

    // Repository now returns ReviewComment entity directly
    return this.repository.createReviewComment(reviewId, data);
  }
}
