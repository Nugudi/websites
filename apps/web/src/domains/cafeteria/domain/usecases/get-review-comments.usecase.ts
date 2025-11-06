/**
 * Get Review Comments UseCase
 *
 * 리뷰 댓글을 조회하는 비즈니스 로직 (무한 스크롤)
 */

import type { GetReviewCommentResponse, PageInfo } from "../../data/dto";
import type { CafeteriaReviewRepository } from "../repositories";

/**
 * UseCase 입력 파라미터
 */
export interface GetReviewCommentsParams {
  cursor?: string;
  size?: number;
}

/**
 * UseCase 출력 결과
 */
export interface GetReviewCommentsResult {
  data: GetReviewCommentResponse[];
  pageInfo: PageInfo;
}

/**
 * Get Review Comments UseCase
 */
export interface GetReviewCommentsUseCase {
  execute(
    reviewId: string,
    params: GetReviewCommentsParams,
  ): Promise<GetReviewCommentsResult>;
}

/**
 * Get Review Comments UseCase Implementation
 */
export class GetReviewCommentsUseCaseImpl implements GetReviewCommentsUseCase {
  constructor(private readonly repository: CafeteriaReviewRepository) {}

  /**
   * UseCase 실행
   */
  async execute(
    reviewId: string,
    params: GetReviewCommentsParams,
  ): Promise<GetReviewCommentsResult> {
    return this.repository.getReviewComments(reviewId, params);
  }
}
