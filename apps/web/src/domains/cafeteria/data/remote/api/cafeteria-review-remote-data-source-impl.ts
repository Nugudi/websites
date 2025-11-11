/**
 * Cafeteria Review Remote DataSource Implementation
 *
 * Infrastructure Layer의 DataSource 구현
 *
 * @remarks
 * - HttpClient를 통해 실제 HTTP 요청 수행
 * - DTO 타입으로 응답 반환
 * - 비즈니스 로직 없음 (순수 데이터 접근만)
 * - Clean Architecture: Infrastructure Layer
 */

import type { HttpClient } from "@core/infrastructure/http/http-client.interface";
import type { CafeteriaReviewRemoteDataSource } from "../../repository/datasource/cafeteria-review-remote-data-source";
import type {
  CreateReviewCommentRequest,
  CreateReviewCommentResponse,
  CreateReviewRequest,
  CreateReviewResponse,
  GetReviewCommentResponse,
  PageInfo,
  PageResponseGetReviewCommentResponse,
  SuccessResponseCreateReviewCommentResponse,
  SuccessResponseCreateReviewResponse,
} from "../dto";

export class CafeteriaReviewRemoteDataSourceImpl
  implements CafeteriaReviewRemoteDataSource
{
  constructor(private readonly httpClient: HttpClient) {}

  /**
   * 리뷰 작성
   */
  async createReview(data: CreateReviewRequest): Promise<CreateReviewResponse> {
    const response =
      await this.httpClient.post<SuccessResponseCreateReviewResponse>(
        "/api/v1/reviews",
        data,
      );

    if (!response.data.data) {
      throw new Error(
        `Failed to create review: ${response.data.message || "No data returned"}`,
      );
    }

    return response.data.data;
  }

  /**
   * 리뷰 댓글 조회 (무한 스크롤)
   */
  async getReviewComments(
    reviewId: string,
    params: {
      cursor?: string;
      size?: number;
    },
  ): Promise<{
    data: GetReviewCommentResponse[];
    pageInfo: PageInfo;
  }> {
    const response =
      await this.httpClient.get<PageResponseGetReviewCommentResponse>(
        `/api/v1/reviews/${reviewId}/comments`,
        { params },
      );

    return {
      data: response.data.data || [],
      pageInfo: response.data.pageInfo || {
        nextCursor: undefined,
        size: 0,
        hasNext: false,
      },
    };
  }

  /**
   * 리뷰 댓글 작성
   */
  async createReviewComment(
    reviewId: string,
    data: CreateReviewCommentRequest,
  ): Promise<CreateReviewCommentResponse> {
    const response =
      await this.httpClient.post<SuccessResponseCreateReviewCommentResponse>(
        `/api/v1/reviews/${reviewId}/comments`,
        data,
      );

    if (!response.data.data) {
      throw new Error(
        `Failed to create review comment: ${response.data.message || "No data returned"}`,
      );
    }

    return response.data.data;
  }

  /**
   * 대댓글 작성
   */
  async createReviewCommentReply(
    reviewId: string,
    commentId: string,
    data: CreateReviewCommentRequest,
  ): Promise<CreateReviewCommentResponse> {
    const response =
      await this.httpClient.post<SuccessResponseCreateReviewCommentResponse>(
        `/api/v1/reviews/${reviewId}/comments/${commentId}/replies`,
        data,
      );

    if (!response.data.data) {
      throw new Error(
        `Failed to create review comment reply: ${response.data.message || "No data returned"}`,
      );
    }

    return response.data.data;
  }
}
