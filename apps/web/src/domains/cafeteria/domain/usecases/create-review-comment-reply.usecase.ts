import type { CreateReviewCommentRequest, ReviewComment } from "../entities";
import type { CafeteriaReviewRepository } from "../repositories";

export interface CreateReviewCommentReplyUseCase {
  execute(
    reviewId: string,
    commentId: string,
    data: CreateReviewCommentRequest,
  ): Promise<ReviewComment>;
}

export class CreateReviewCommentReplyUseCaseImpl
  implements CreateReviewCommentReplyUseCase
{
  constructor(private readonly repository: CafeteriaReviewRepository) {}

  async execute(
    reviewId: string,
    commentId: string,
    data: CreateReviewCommentRequest,
  ): Promise<ReviewComment> {
    if (!data.content || data.content.trim().length === 0) {
      throw new Error("Reply content is required");
    }

    return this.repository.createReviewCommentReply(reviewId, commentId, data);
  }
}
