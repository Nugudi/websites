/**
 * Create Review Comment Reply UseCase
 *
 * 대댓글을 작성하는 비즈니스 로직
 */

import type {
  CreateReviewCommentRequest,
  CreateReviewCommentResponse,
} from "../../data/dto";
import type { CafeteriaReviewRepository } from "../repositories";

/**
 * CreateReviewCommentReply UseCase
 */
export class CreateReviewCommentReply {
  constructor(private readonly repository: CafeteriaReviewRepository) {}

  /**
   * UseCase 실행
   */
  async execute(
    reviewId: string,
    commentId: string,
    data: CreateReviewCommentRequest,
  ): Promise<CreateReviewCommentResponse> {
    // Validate required fields
    if (!data.content || data.content.trim().length === 0) {
      throw new Error("Reply content is required");
    }

    return this.repository.createReviewCommentReply(reviewId, commentId, data);
  }
}
