import type { CreateReviewCommentRequest, ReviewComment } from "../entities";
import type { CafeteriaReviewRepository } from "../repositories";

export interface CreateReviewCommentUseCase {
  execute(
    reviewId: string,
    data: CreateReviewCommentRequest,
  ): Promise<ReviewComment>;
}

export class CreateReviewCommentUseCaseImpl
  implements CreateReviewCommentUseCase
{
  constructor(private readonly repository: CafeteriaReviewRepository) {}

  async execute(
    reviewId: string,
    data: CreateReviewCommentRequest,
  ): Promise<ReviewComment> {
    if (!data.content || data.content.trim().length === 0) {
      throw new Error("Comment content is required");
    }

    return this.repository.createReviewComment(reviewId, data);
  }
}
