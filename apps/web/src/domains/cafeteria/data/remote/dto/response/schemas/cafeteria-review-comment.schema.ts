/**
 * Cafeteria Review Comment Validation Schemas
 *
 * Zod schemas for runtime validation of Cafeteria Review Comment data from API
 */

import { z } from "zod";

export const CommentStatusSchema = z.enum([
  "ACTIVE",
  "USER_DELETED",
  "OWNER_WITHDRAWN",
  "ADMIN_DELETED",
  "BLOCKED",
  "REPORTED",
]);

/** 댓글 작성자 */
export const CommentAuthorSchema = z.object({
  userId: z.number().int().positive(),
  nickname: z.string().min(1),
  profileImageUrl: z.string().nullable(),
});

/** 리뷰 댓글 */
export const ReviewCommentSchema = z.object({
  commentId: z.number().int().positive(),
  content: z.string().min(1),
  commentStatus: CommentStatusSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
  isAuthor: z.boolean().optional(),
});

/** 대댓글 메타 정보 */
export const ReplyMetadataSchema = z.object({
  totalReplyCount: z.number().int().min(0),
  hasReplies: z.boolean(),
});

/** 리뷰 댓글 (메타데이터 포함) */
export const ReviewCommentWithMetadataSchema = z.object({
  comment: ReviewCommentSchema,
  author: CommentAuthorSchema,
  replyMetadata: ReplyMetadataSchema,
});

/** 리뷰 댓글 작성 요청 */
export const CreateReviewCommentRequestSchema = z.object({
  content: z.string().min(1),
  parentCommentId: z.number().int().positive().nullable().optional(),
});
