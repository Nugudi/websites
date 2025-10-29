/**
 * Cafeteria Review Service
 *
 * 리뷰 비즈니스 로직을 담당하는 Service Layer
 * Repository를 조합하여 복잡한 비즈니스 플로우를 처리합니다.
 */

import type { CafeteriaReviewRepository } from "../repositories";
import type {
  CreateReviewCommentRequest,
  CreateReviewCommentResponse,
  CreateReviewRequest,
  CreateReviewResponse,
  // DeleteReviewCommentResponse, // TODO: OpenAPI 타입 추가되면 활성화
  GetReviewCommentResponse,
  PageInfo,
  // ReplyInfo, // TODO: OpenAPI 타입 추가되면 활성화
  // UpdateReviewCommentRequest, // TODO: OpenAPI 타입 추가되면 활성화
  // UpdateReviewCommentResponse, // TODO: OpenAPI 타입 추가되면 활성화
} from "../types";

/**
 * Cafeteria Review Service Interface
 */
export interface CafeteriaReviewService {
  // ==========================================
  // Review 작성
  // ==========================================

  /**
   * 리뷰 작성
   *
   * @param data - 리뷰 작성 데이터
   * @returns 작성된 리뷰 정보
   */
  createReview(data: CreateReviewRequest): Promise<CreateReviewResponse>;

  // ==========================================
  // Comment 조회
  // ==========================================

  /**
   * 리뷰 댓글 조회 (무한 스크롤)
   *
   * @param reviewId - 리뷰 ID
   * @param params - 조회 파라미터
   * @returns 댓글 리스트와 페이지 정보
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
   *
   * @param reviewId - 리뷰 ID
   * @param commentId - 댓글 ID
   * @param params - 조회 파라미터
   * @returns 대댓글 리스트와 페이지 정보
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
   *
   * @param reviewId - 리뷰 ID
   * @param data - 댓글 작성 데이터
   * @returns 작성된 댓글 정보
   */
  createReviewComment(
    reviewId: string,
    data: CreateReviewCommentRequest,
  ): Promise<CreateReviewCommentResponse>;

  /**
   * 대댓글 작성
   *
   * @param reviewId - 리뷰 ID
   * @param commentId - 댓글 ID
   * @param data - 대댓글 작성 데이터
   * @returns 작성된 대댓글 정보
   */
  createReviewCommentReply(
    reviewId: string,
    commentId: string,
    data: CreateReviewCommentRequest,
  ): Promise<CreateReviewCommentResponse>;

  /**
   * TODO: OpenAPI 타입 추가되면 활성화
   * 리뷰 댓글 수정
   *
   * @param reviewId - 리뷰 ID
   * @param commentId - 댓글 ID
   * @param data - 댓글 수정 데이터
   * @returns 수정된 댓글 정보
   */
  // updateReviewComment(
  //   reviewId: string,
  //   commentId: string,
  //   data: UpdateReviewCommentRequest,
  // ): Promise<UpdateReviewCommentResponse>;

  /**
   * TODO: OpenAPI 타입 추가되면 활성화
   * 리뷰 댓글 삭제
   *
   * @param reviewId - 리뷰 ID
   * @param commentId - 댓글 ID
   * @returns 삭제된 댓글 정보
   */
  // deleteReviewComment(
  //   reviewId: string,
  //   commentId: string,
  // ): Promise<DeleteReviewCommentResponse>;
}

/**
 * Cafeteria Review Service Implementation
 */
export class CafeteriaReviewServiceImpl implements CafeteriaReviewService {
  constructor(private readonly repository: CafeteriaReviewRepository) {}

  async createReview(data: CreateReviewRequest): Promise<CreateReviewResponse> {
    // Validate required fields
    if (!data.restaurantId) {
      throw new Error("Restaurant ID is required");
    }
    if (!data.reviewDate) {
      throw new Error("Review date is required");
    }
    if (!data.tasteTypeId) {
      throw new Error("Taste type is required");
    }

    return this.repository.createReview(data);
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
    return this.repository.getReviewComments(reviewId, params);
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
  //   return this.repository.getReviewCommentReplies(reviewId, commentId, params);
  // }

  async createReviewComment(
    reviewId: string,
    data: CreateReviewCommentRequest,
  ): Promise<CreateReviewCommentResponse> {
    // Validate required fields
    if (!data.content || data.content.trim().length === 0) {
      throw new Error("Comment content is required");
    }

    return this.repository.createReviewComment(reviewId, data);
  }

  async createReviewCommentReply(
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

  // TODO: OpenAPI 타입 추가되면 활성화
  // async updateReviewComment(
  //   reviewId: string,
  //   commentId: string,
  //   data: UpdateReviewCommentRequest,
  // ): Promise<UpdateReviewCommentResponse> {
  //   // Validate required fields
  //   if (!data.content || data.content.trim().length === 0) {
  //     throw new Error("Comment content is required");
  //   }

  //   return this.repository.updateReviewComment(reviewId, commentId, data);
  // }

  // TODO: OpenAPI 타입 추가되면 활성화
  // async deleteReviewComment(
  //   reviewId: string,
  //   commentId: string,
  // ): Promise<DeleteReviewCommentResponse> {
  //   return this.repository.deleteReviewComment(reviewId, commentId);
  // }
}
