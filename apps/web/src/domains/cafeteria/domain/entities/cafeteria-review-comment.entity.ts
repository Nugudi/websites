/**
 * Cafeteria Review Comment Domain Entities
 * Entity: camelCase | DTO: snake_case
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

export type CommentStatus = z.infer<typeof CommentStatusSchema>;

/** 댓글 작성자 */
export const CommentAuthorSchema = z.object({
  userId: z.number().int().positive(),
  nickname: z.string().min(1),
  profileImageUrl: z.string().nullable(),
});

export type CommentAuthor = z.infer<typeof CommentAuthorSchema>;

/** 리뷰 댓글 */
export const ReviewCommentSchema = z.object({
  commentId: z.number().int().positive(),
  content: z.string().min(1),
  commentStatus: CommentStatusSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
  isAuthor: z.boolean().optional(),
});

export type ReviewComment = z.infer<typeof ReviewCommentSchema>;

/** 대댓글 메타 정보 */
export const ReplyMetadataSchema = z.object({
  totalReplyCount: z.number().int().min(0),
  hasReplies: z.boolean(),
});

export type ReplyMetadata = z.infer<typeof ReplyMetadataSchema>;

/** 리뷰 댓글 (메타데이터 포함) */
export const ReviewCommentWithMetadataSchema = z.object({
  comment: ReviewCommentSchema,
  author: CommentAuthorSchema,
  replyMetadata: ReplyMetadataSchema,
});

export type ReviewCommentWithMetadata = z.infer<
  typeof ReviewCommentWithMetadataSchema
>;

/** 리뷰 댓글 작성 요청 */
export const CreateReviewCommentRequestSchema = z.object({
  content: z.string().min(1),
  parentCommentId: z.number().int().positive().nullable().optional(),
});

export type CreateReviewCommentRequest = z.infer<
  typeof CreateReviewCommentRequestSchema
>;
