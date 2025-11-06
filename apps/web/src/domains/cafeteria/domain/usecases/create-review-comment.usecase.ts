/**
 * Create Review Comment UseCase
 *
 * 리뷰 댓글을 작성하는 비즈니스 로직
 */

import type {
  CreateReviewCommentRequest,
  CreateReviewCommentResponse,
} from "../../data/dto";
import type { CafeteriaReviewRepository } from "../repositories";

/**
 * CreateReviewComment UseCase
 */
export class CreateReviewComment {
  constructor(private readonly repository: CafeteriaReviewRepository) {}

  /**
   * UseCase 실행
   */
  async execute(
    reviewId: string,
    data: CreateReviewCommentRequest,
  ): Promise<CreateReviewCommentResponse> {
    // Validate required fields
    if (!data.content || data.content.trim().length === 0) {
      throw new Error("Comment content is required");
    }

    return this.repository.createReviewComment(reviewId, data);
  }
}
