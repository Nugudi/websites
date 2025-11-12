/**
 * Cafeteria Review Response Types (DTO Layer)
 *
 * These are simple data structures without business logic.
 * Used for API response mapping only.
 */

import type { MealType } from "./cafeteria-menu-types";

/** 리뷰 Entity */
export interface Review {
  readonly id: number;
  readonly restaurantId: number;
  readonly reviewDate: string;
  readonly mealType: MealType;
  readonly tasteTypeId: number;
  readonly content: string;
  readonly mainImageUrl: string | null;
  readonly likeCount: number;
  readonly createdAt: string;
}

export type CommentStatus =
  | "ACTIVE"
  | "USER_DELETED"
  | "OWNER_WITHDRAWN"
  | "ADMIN_DELETED"
  | "BLOCKED"
  | "REPORTED";

/** 댓글 작성자 */
export interface CommentAuthor {
  readonly userId: number;
  readonly nickname: string;
  readonly profileImageUrl: string | null;
}

/** 리뷰 댓글 */
export interface ReviewComment {
  readonly commentId: number;
  readonly content: string;
  readonly commentStatus: CommentStatus;
  readonly createdAt: string;
  readonly updatedAt?: string;
  readonly isAuthor?: boolean;
}

/** 대댓글 메타 정보 */
export interface ReplyMetadata {
  readonly totalReplyCount: number;
  readonly hasReplies: boolean;
}

/** 리뷰 댓글 (메타데이터 포함) */
export interface ReviewCommentWithMetadata {
  readonly comment: ReviewComment;
  readonly author: CommentAuthor;
  readonly replyMetadata: ReplyMetadata;
}
