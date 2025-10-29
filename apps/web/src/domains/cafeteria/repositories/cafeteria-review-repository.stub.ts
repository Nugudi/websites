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
  async createReview(
    _data: CreateReviewRequest,
  ): Promise<CreateReviewResponse> {
    // TODO: Phase 4 - Replace with proper mock data
    return {
      reviewId: Date.now(),
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
    _reviewId: string,
    _data: CreateReviewCommentRequest,
  ): Promise<CreateReviewCommentResponse> {
    // TODO: Phase 4 - Replace with proper mock data
    return {
      commentId: Date.now(),
    };
  }

  async createReviewCommentReply(
    _reviewId: string,
    _commentId: string,
    _data: CreateReviewCommentRequest,
  ): Promise<CreateReviewCommentResponse> {
    // TODO: Phase 4 - Replace with proper mock data
    return {
      commentId: Date.now(),
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
