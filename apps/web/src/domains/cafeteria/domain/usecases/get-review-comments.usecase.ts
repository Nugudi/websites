import type { PageInfo } from "@shared/domain/entities";
import type { ReviewCommentWithMetadata } from "../entities";
import type { CafeteriaReviewRepository } from "../repositories";

export interface GetReviewCommentsParams {
  cursor?: string;
  size?: number;
}

export interface GetReviewCommentsResult {
  data: ReviewCommentWithMetadata[];
  pageInfo: PageInfo;
}

export interface GetReviewCommentsUseCase {
  execute(
    reviewId: string,
    params: GetReviewCommentsParams,
  ): Promise<GetReviewCommentsResult>;
}

export class GetReviewCommentsUseCaseImpl implements GetReviewCommentsUseCase {
  constructor(private readonly repository: CafeteriaReviewRepository) {}

  async execute(
    reviewId: string,
    params: GetReviewCommentsParams,
  ): Promise<GetReviewCommentsResult> {
    return this.repository.getReviewComments(reviewId, params);
  }
}
