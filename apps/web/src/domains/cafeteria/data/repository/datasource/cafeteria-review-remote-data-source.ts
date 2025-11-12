/**
 * Cafeteria Review Remote DataSource Interface
 *
 * Data Layer의 DataSource 인터페이스
 *
 * @remarks
 * - Repository에서 사용하는 계약(Contract)
 * - 구체적인 구현은 remote/api/에 위치
 * - Clean Architecture: Data Layer
 */

import type {
  CreateReviewCommentRequest,
  CreateReviewCommentResponse,
  CreateReviewRequest,
  CreateReviewResponse,
  GetReviewCommentResponse,
  PageInfo,
} from "../../remote/dto";

export interface CafeteriaReviewRemoteDataSource {
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
