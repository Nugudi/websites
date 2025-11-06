import type { PageInfo } from "@shared/domain/entities";
import type {
  CreateReviewCommentRequest as CreateReviewCommentRequestEntity,
  CreateReviewRequest as CreateReviewRequestEntity,
  Review,
  ReviewComment,
  ReviewCommentWithMetadata,
} from "../../domain/entities";
import type { CafeteriaReviewRepository } from "../../domain/repositories";
import type { CreateReviewCommentResponse, CreateReviewResponse } from "../dto";
import {
  createReviewCommentResponseToDomain,
  createReviewResponseToDomain,
  pageInfoDtoToDomain,
} from "../mappers";

/**
 * Cafeteria Review Repository Stub
 *
 * Mock 데이터를 반환하는 Review Repository Stub 구현
 * - 환경 변수 NEXT_PUBLIC_USE_MOCK=true일 때 사용
 * - HttpClient 없이 동작하며 실제 API 호출하지 않음
 * - Mock DTO를 생성한 후 Mapper로 Entity 변환
 */
export class CafeteriaReviewRepositoryStub
  implements CafeteriaReviewRepository
{
  async createReview(data: CreateReviewRequestEntity): Promise<Review> {
    // Mock DTO 생성
    const mockResponse: CreateReviewResponse = {
      reviewId: Date.now(),
      restaurantId: data.restaurantId,
      reviewDate: data.reviewDate,
      mealType: data.mealType,
      tasteTypeId: data.tasteTypeId,
      content: data.content,
      mainImageUrl: null, // Converted from mainImageFileId on backend
      likeCount: 0,
      createdAt: new Date().toISOString(),
    };

    // Mapper로 Entity 변환
    return createReviewResponseToDomain(mockResponse);
  }

  async getReviewComments(
    _reviewId: string,
    _params: {
      cursor?: string;
      size?: number;
    },
  ): Promise<{
    data: ReviewCommentWithMetadata[];
    pageInfo: PageInfo;
  }> {
    // Mock DTO 생성
    const mockPageInfo = {
      nextCursor: null,
      size: 0,
      hasNext: false,
    };

    // Mapper로 Entity 변환
    return {
      data: [],
      pageInfo: pageInfoDtoToDomain(mockPageInfo),
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
  //   // TODO: Phase 4 - Replace with proper mock data
  //   return {
  //     data: [],
  //     pageInfo: {
  //       nextCursor: undefined,
  //       size: 0,
  //       hasNext: false,
  //     },
  //   };
  // }

  async createReviewComment(
    reviewId: string,
    data: CreateReviewCommentRequestEntity,
  ): Promise<ReviewComment> {
    // Mock DTO 생성
    const mockResponse: CreateReviewCommentResponse = {
      commentId: Date.now(),
      reviewId: Number(reviewId),
      parentCommentId: data.parentCommentId ?? null,
      content: data.content,
      commentStatus: "ACTIVE",
      createdAt: new Date().toISOString(),
    };

    // Mapper로 Entity 변환
    return createReviewCommentResponseToDomain(mockResponse);
  }

  async createReviewCommentReply(
    reviewId: string,
    commentId: string,
    data: CreateReviewCommentRequestEntity,
  ): Promise<ReviewComment> {
    // Mock DTO 생성
    const mockResponse: CreateReviewCommentResponse = {
      commentId: Date.now(),
      reviewId: Number(reviewId),
      parentCommentId: Number(commentId),
      content: data.content,
      commentStatus: "ACTIVE",
      createdAt: new Date().toISOString(),
    };

    // Mapper로 Entity 변환
    return createReviewCommentResponseToDomain(mockResponse);
  }

  // TODO: OpenAPI 타입 추가되면 활성화
  // async updateReviewComment(
  //   reviewId: string,
  //   commentId: string,
  //   data: UpdateReviewCommentRequest,
  // ): Promise<UpdateReviewCommentResponse> {
  //   // TODO: Phase 4 - Replace with proper mock data
  //   return {
  //     commentId: Number(commentId),
  //   };
  // }

  // TODO: OpenAPI 타입 추가되면 활성화
  // async deleteReviewComment(
  //   reviewId: string,
  //   commentId: string,
  // ): Promise<DeleteReviewCommentResponse> {
  //   // TODO: Phase 4 - Replace with proper mock data
  //   return {};
  // }
}
