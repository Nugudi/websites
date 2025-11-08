/**
 * Cafeteria Review Repository Interface
 *
 * 리뷰 데이터 접근 계층 인터페이스
 * - 모든 HTTP 요청은 이 레이어에서 처리
 * - 비즈니스 로직 없음 (순수 데이터 액세스만)
 */

import type { PageInfo } from "@core/types";
import type {
  CreateReviewCommentRequest,
  CreateReviewRequest,
  Review,
  ReviewComment,
  ReviewCommentWithMetadata,
} from "../entities";

export interface CafeteriaReviewRepository {
  createReview(data: CreateReviewRequest): Promise<Review>;

  getReviewComments(
    reviewId: string,
    params: {
      cursor?: string;
      size?: number;
    },
  ): Promise<{
    data: ReviewCommentWithMetadata[];
    pageInfo: PageInfo;
  }>;

  createReviewComment(
    reviewId: string,
    data: CreateReviewCommentRequest,
  ): Promise<ReviewComment>;

  createReviewCommentReply(
    reviewId: string,
    commentId: string,
    data: CreateReviewCommentRequest,
  ): Promise<ReviewComment>;
}
