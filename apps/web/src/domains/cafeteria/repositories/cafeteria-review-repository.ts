import type { HttpClient } from "@/src/shared/infrastructure/http";
import type {
  CreateReviewCommentRequest,
  CreateReviewCommentResponse,
  CreateReviewRequest,
  CreateReviewResponse,
  // DeleteReviewCommentResponse, // TODO: OpenAPI 타입 추가되면 활성화
  GetReviewCommentResponse,
  PageInfo,
  PageResponseGetReviewCommentResponse,
  // PageResponseReplyInfo, // TODO: OpenAPI 타입 추가되면 활성화
  // ReplyInfo, // TODO: OpenAPI 타입 추가되면 활성화
  SuccessResponseCreateReviewCommentResponse,
  SuccessResponseCreateReviewResponse,
  // SuccessResponseDeleteReviewCommentResponse, // TODO: OpenAPI 타입 추가되면 활성화
  // SuccessResponseUpdateReviewCommentResponse, // TODO: OpenAPI 타입 추가되면 활성화
  // UpdateReviewCommentRequest, // TODO: OpenAPI 타입 추가되면 활성화
  // UpdateReviewCommentResponse, // TODO: OpenAPI 타입 추가되면 활성화
} from "../types";

/**
 * Cafeteria Review Repository Interface
 *
 * 리뷰 데이터 접근 계층
 * - 모든 HTTP 요청은 이 레이어에서 처리
 * - 비즈니스 로직 없음 (순수 데이터 액세스만)
 */
export interface CafeteriaReviewRepository {
  // ==========================================
  // Review 작성
  // ==========================================

  /**
   * 리뷰 작성
   * POST /api/v1/reviews
   *
   * @param data - 리뷰 작성 데이터
   */
  createReview(data: CreateReviewRequest): Promise<CreateReviewResponse>;

  // ==========================================
  // Comment 조회
  // ==========================================

  /**
   * 리뷰 댓글 조회 (무한 스크롤)
   * GET /api/v1/reviews/{reviewId}/comments
   *
   * @param reviewId - 리뷰 ID
   * @param params - 조회 파라미터 (커서, 사이즈)
   */
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

  /**
   * TODO: OpenAPI 타입 추가되면 활성화
   * 대댓글 조회 (무한 스크롤)
   * GET /api/v1/reviews/{reviewId}/comments/{commentId}/replies
   *
   * @param reviewId - 리뷰 ID
   * @param commentId - 댓글 ID
   * @param params - 조회 파라미터 (커서, 사이즈)
   */
  // getReviewCommentReplies(
  //   reviewId: string,
  //   commentId: string,
  //   params: {
  //     cursor?: string;
  //     size?: number;
  //   },
  // ): Promise<{
  //   data: ReplyInfo[];
  //   pageInfo: PageInfo;
  // }>;

  // ==========================================
  // Comment 작성/수정/삭제
  // ==========================================

  /**
   * 리뷰 댓글 작성
   * POST /api/v1/reviews/{reviewId}/comments
   *
   * @param reviewId - 리뷰 ID
   * @param data - 댓글 작성 데이터
   */
  createReviewComment(
    reviewId: string,
    data: CreateReviewCommentRequest,
  ): Promise<CreateReviewCommentResponse>;

  /**
   * 대댓글 작성
   * POST /api/v1/reviews/{reviewId}/comments/{commentId}/replies
   *
   * @param reviewId - 리뷰 ID
   * @param commentId - 댓글 ID
   * @param data - 대댓글 작성 데이터
   */
  createReviewCommentReply(
    reviewId: string,
    commentId: string,
    data: CreateReviewCommentRequest,
  ): Promise<CreateReviewCommentResponse>;

  /**
   * TODO: OpenAPI 타입 추가되면 활성화
   * 리뷰 댓글 수정
   * PATCH /api/v1/reviews/{reviewId}/comments/{commentId}
   *
   * @param reviewId - 리뷰 ID
   * @param commentId - 댓글 ID
   * @param data - 댓글 수정 데이터
   */
  // updateReviewComment(
  //   reviewId: string,
  //   commentId: string,
  //   data: UpdateReviewCommentRequest,
  // ): Promise<UpdateReviewCommentResponse>;

  /**
   * TODO: OpenAPI 타입 추가되면 활성화
   * 리뷰 댓글 삭제
   * DELETE /api/v1/reviews/{reviewId}/comments/{commentId}
   *
   * @param reviewId - 리뷰 ID
   * @param commentId - 댓글 ID
   */
  // deleteReviewComment(
  //   reviewId: string,
  //   commentId: string,
  // ): Promise<DeleteReviewCommentResponse>;
}

/**
 * Cafeteria Review Repository Implementation
 *
 * HttpClient를 사용하여 실제 API 호출 수행
 */
export class CafeteriaReviewRepositoryImpl
  implements CafeteriaReviewRepository
{
  constructor(private readonly httpClient: HttpClient) {}

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

  // TODO: OpenAPI 타입 추가되면 활성화
  // async getReviewCommentReplies(
  //   reviewId: string,
  //   commentId: string,
  //   params: {
  //     cursor?: string;
  //     size?: number;
  //   },
  // ): Promise<{
  //   data: ReplyInfo[];
  //   pageInfo: PageInfo;
  // }> {
  //   const response = await this.httpClient.get<PageResponseReplyInfo>(
  //     `/api/v1/reviews/${reviewId}/comments/${commentId}/replies`,
  //     { params },
  //   );

  //   return {
  //     data: response.data.data || [],
  //     pageInfo: response.data.pageInfo || {
  //       nextCursor: undefined,
  //       size: 0,
  //       hasNext: false,
  //     },
  //   };
  // }

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

  // TODO: OpenAPI 타입 추가되면 활성화
  // async updateReviewComment(
  //   reviewId: string,
  //   commentId: string,
  //   data: UpdateReviewCommentRequest,
  // ): Promise<UpdateReviewCommentResponse> {
  //   const response =
  //     await this.httpClient.patch<SuccessResponseUpdateReviewCommentResponse>(
  //       `/api/v1/reviews/${reviewId}/comments/${commentId}`,
  //       data,
  //     );
  //   return response.data.data!;
  // }

  // TODO: OpenAPI 타입 추가되면 활성화
  // async deleteReviewComment(
  //   reviewId: string,
  //   commentId: string,
  // ): Promise<DeleteReviewCommentResponse> {
  //   const response =
  //     await this.httpClient.delete<SuccessResponseDeleteReviewCommentResponse>(
  //       `/api/v1/reviews/${reviewId}/comments/${commentId}`,
  //     );
  //   return response.data.data!;
  // }
}
