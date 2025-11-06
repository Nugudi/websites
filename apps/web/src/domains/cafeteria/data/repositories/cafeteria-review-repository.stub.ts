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
} from "../dto";
import type { CafeteriaReviewRepository } from "./cafeteria-review-repository";

/**
 * Cafeteria Review Repository Stub
 *
 * Mock 데이터를 반환하는 Review Repository Stub 구현
 * - 환경 변수 NEXT_PUBLIC_USE_MOCK=true일 때 사용
 * - HttpClient 없이 동작하며 실제 API 호출하지 않음
 */
export class CafeteriaReviewRepositoryStub
  implements CafeteriaReviewRepository
{
  async createReview(data: CreateReviewRequest): Promise<CreateReviewResponse> {
    // TODO: Phase 4 - Replace with proper mock data
    return {
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
  }

  async getReviewComments(
    _reviewId: string,
    _params: {
      cursor?: string;
      size?: number;
    },
  ): Promise<{
    data: GetReviewCommentResponse[];
    pageInfo: PageInfo;
  }> {
    // TODO: Phase 4 - Replace with proper mock data
    return {
      data: [],
      pageInfo: {
        nextCursor: null,
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
    data: CreateReviewCommentRequest,
  ): Promise<CreateReviewCommentResponse> {
    // TODO: Phase 4 - Replace with proper mock data
    return {
      commentId: Date.now(),
      reviewId: Number(reviewId),
      parentCommentId: data.parentCommentId ?? null,
      content: data.content,
      commentStatus: "ACTIVE",
      createdAt: new Date().toISOString(),
    };
  }

  async createReviewCommentReply(
    reviewId: string,
    commentId: string,
    data: CreateReviewCommentRequest,
  ): Promise<CreateReviewCommentResponse> {
    // TODO: Phase 4 - Replace with proper mock data
    return {
      commentId: Date.now(),
      reviewId: Number(reviewId),
      parentCommentId: Number(commentId),
      content: data.content,
      commentStatus: "ACTIVE",
      createdAt: new Date().toISOString(),
    };
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
