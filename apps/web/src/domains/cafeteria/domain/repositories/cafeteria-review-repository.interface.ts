/**
 * Cafeteria Review Repository Interface
 *
 * 리뷰 데이터 접근 계층 인터페이스
 * - 모든 HTTP 요청은 이 레이어에서 처리
 * - 비즈니스 로직 없음 (순수 데이터 액세스만)
 */

import type {
  CreateReviewCommentRequest,
  CreateReviewCommentResponse,
  CreateReviewRequest,
  CreateReviewResponse,
  GetReviewCommentResponse,
  PageInfo,
} from "../../data/dto";

export interface CafeteriaReviewRepository {
  createReview(data: CreateReviewRequest): Promise<CreateReviewResponse>;

  getReviewComments(
    reviewId: string,
    params: {
      cursor?: string;
      size?: number;
    },
  ): Promise<{
    data: GetReviewCommentResponse[];
    pageInfo: PageInfo;
  }>;

  createReviewComment(
    reviewId: string,
    data: CreateReviewCommentRequest,
  ): Promise<CreateReviewCommentResponse>;

  createReviewCommentReply(
    reviewId: string,
    commentId: string,
    data: CreateReviewCommentRequest,
  ): Promise<CreateReviewCommentResponse>;
}
