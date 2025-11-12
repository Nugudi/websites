/**
 * Cafeteria Review Mock DataSource
 *
 * Mock implementation of CafeteriaReviewRemoteDataSource
 * - Simulates API responses with mock data in DTO format
 * - Matches Remote DataSource interface
 * - Easily replaceable with real API implementation
 *
 * Pattern:
 * 1. Define mock data in DTO format (matching OpenAPI types)
 * 2. Simulate network delay (100ms)
 * 3. Return DTO responses
 *
 * Note: 실제 API 구현 시 CafeteriaReviewRemoteDataSourceImpl로 교체
 */

import type { CafeteriaReviewRemoteDataSource } from "../../repository/datasource/cafeteria-review-remote-data-source";
import type {
  CreateReviewCommentRequest,
  CreateReviewCommentResponse,
  CreateReviewRequest,
  CreateReviewResponse,
  GetReviewCommentResponse,
  PageInfo,
} from "../dto";

/**
 * Mock Review Comment Data (DTO format)
 */
const MOCK_REVIEW_COMMENTS_DTO: GetReviewCommentResponse[] = [
  {
    comment: {
      commentId: 1,
      content: "구내식당 맛있어요. 🥟",
      commentStatus: "ACTIVE",
      createdAt: "2025-01-06T01:00:00Z",
      updatedAt: "2025-01-06T01:00:00Z",
      isAuthor: false,
    },
    author: {
      userId: 1,
      nickname: "애옹",
      profileImageUrl: null,
    },
    replyMetadata: {
      totalReplyCount: 3,
      hasReplies: true,
    },
  },
  {
    comment: {
      commentId: 3,
      content: "구내식당 싫어.",
      commentStatus: "ACTIVE",
      createdAt: "2025-01-06T01:00:00Z",
      updatedAt: "2025-01-06T01:00:00Z",
      isAuthor: false,
    },
    author: {
      userId: 2,
      nickname: "조울핑",
      profileImageUrl: null,
    },
    replyMetadata: {
      totalReplyCount: 0,
      hasReplies: false,
    },
  },
  {
    comment: {
      commentId: 4,
      content: "구내식당 싫어.",
      commentStatus: "ACTIVE",
      createdAt: "2025-01-06T01:00:00Z",
      updatedAt: "2025-01-06T01:00:00Z",
      isAuthor: false,
    },
    author: {
      userId: 2,
      nickname: "조울핑",
      profileImageUrl: null,
    },
    replyMetadata: {
      totalReplyCount: 0,
      hasReplies: false,
    },
  },
  {
    comment: {
      commentId: 5,
      content: "구내식당 싫어.",
      commentStatus: "ACTIVE",
      createdAt: "2025-01-06T01:00:00Z",
      updatedAt: "2025-01-06T01:00:00Z",
      isAuthor: false,
    },
    author: {
      userId: 2,
      nickname: "조울핑",
      profileImageUrl: null,
    },
    replyMetadata: {
      totalReplyCount: 0,
      hasReplies: false,
    },
  },
  {
    comment: {
      commentId: 6,
      content: "구내식당 싫어.",
      commentStatus: "ACTIVE",
      createdAt: "2025-01-06T01:00:00Z",
      updatedAt: "2025-01-06T01:00:00Z",
      isAuthor: false,
    },
    author: {
      userId: 2,
      nickname: "조울핑",
      profileImageUrl: null,
    },
    replyMetadata: {
      totalReplyCount: 0,
      hasReplies: false,
    },
  },
];

/**
 * Mock DataSource Implementation
 * - 실제 API 대신 Mock 데이터 반환
 * - 네트워크 지연 시뮬레이션 (100ms)
 * - Repository layer에서 사용
 */
export class CafeteriaReviewRemoteDataSourceMockImpl
  implements CafeteriaReviewRemoteDataSource
{
  private comments: GetReviewCommentResponse[] = [...MOCK_REVIEW_COMMENTS_DTO];

  /**
   * 리뷰 작성
   */
  async createReview(data: CreateReviewRequest): Promise<CreateReviewResponse> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    return {
      reviewId: Date.now(),
      restaurantId: data.restaurantId,
      reviewDate: data.reviewDate,
      mealType: data.mealType,
      tasteTypeId: data.tasteTypeId,
      content: data.content,
      mainImageUrl: null,
      likeCount: 0,
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * 리뷰 댓글 조회 (무한 스크롤)
   * @returns 댓글 목록과 페이지 정보
   */
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
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    return {
      data: this.comments,
      pageInfo: {
        nextCursor: null,
        size: this.comments.length,
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
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    return {
      commentId: Date.now(),
      reviewId: Number(reviewId),
      parentCommentId: data.parentCommentId ?? null,
      content: data.content,
      commentStatus: "ACTIVE",
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * 대댓글 작성
   */
  async createReviewCommentReply(
    reviewId: string,
    commentId: string,
    data: CreateReviewCommentRequest,
  ): Promise<CreateReviewCommentResponse> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    return {
      commentId: Date.now(),
      reviewId: Number(reviewId),
      parentCommentId: Number(commentId),
      content: data.content,
      commentStatus: "ACTIVE",
      createdAt: new Date().toISOString(),
    };
  }
}
