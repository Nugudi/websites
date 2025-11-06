/**
 * Create Review Comment Reply UseCase
 *
 * 대댓글을 작성하는 비즈니스 로직
 */

import type { CreateReviewCommentRequest, ReviewComment } from "../entities";
import type { CafeteriaReviewRepository } from "../repositories";

/**
 * Create Review Comment Reply UseCase
 */
export interface CreateReviewCommentReplyUseCase {
  execute(
    reviewId: string,
    commentId: string,
    data: CreateReviewCommentRequest,
  ): Promise<ReviewComment>;
}

/**
 * Create Review Comment Reply UseCase Implementation
 */
export class CreateReviewCommentReplyUseCaseImpl
  implements CreateReviewCommentReplyUseCase
{
  constructor(private readonly repository: CafeteriaReviewRepository) {}

  /**
   * UseCase 실행
   */
  async execute(
    reviewId: string,
    commentId: string,
    data: CreateReviewCommentRequest,
  ): Promise<ReviewComment> {
    // Validate required fields
    if (!data.content || data.content.trim().length === 0) {
      throw new Error("Reply content is required");
    }

    // Repository now returns ReviewComment entity directly
    return this.repository.createReviewCommentReply(reviewId, commentId, data);
  }
}
