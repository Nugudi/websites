/**
 * Cafeteria Review Mapper
 *
 * DTO → Entity 변환 (Zod 검증 포함)
 */

import {
  type CreateReviewCommentRequest,
  CreateReviewCommentRequestSchema,
  type CreateReviewRequest,
  CreateReviewRequestSchema,
  type Review,
  type ReviewComment,
  ReviewCommentSchema,
  type ReviewCommentWithMetadata,
  ReviewCommentWithMetadataSchema,
  ReviewSchema,
} from "../../domain/entities";
import type {
  CreateReviewCommentRequest as CreateReviewCommentRequestDTO,
  CreateReviewCommentResponse,
  CreateReviewRequest as CreateReviewRequestDTO,
  CreateReviewResponse,
  GetReviewCommentResponse,
} from "../dto";

/**
 * CreateReviewResponse DTO → Review Entity
 */
export function createReviewResponseToDomain(
  dto: CreateReviewResponse,
): Review {
  if (!dto) {
    throw new Error("CreateReviewResponse is null");
  }

  const entity = {
    id: dto.reviewId,
    restaurantId: dto.restaurantId,
    reviewDate: dto.reviewDate,
    mealType: dto.mealType,
    tasteTypeId: dto.tasteTypeId,
    content: dto.content,
    mainImageUrl: dto.mainImageUrl,
    likeCount: dto.likeCount,
    createdAt: dto.createdAt,
  };

  return ReviewSchema.parse(entity);
}

/**
 * GetReviewCommentResponse DTO → ReviewCommentWithMetadata Entity
 */
export function getReviewCommentResponseToDomain(
  dto: GetReviewCommentResponse,
): ReviewCommentWithMetadata {
  const entity = {
    comment: {
      commentId: dto.comment.commentId,
      content: dto.comment.content,
      commentStatus: dto.comment.commentStatus,
      createdAt: dto.comment.createdAt,
      updatedAt: dto.comment.updatedAt,
      isAuthor: dto.comment.isAuthor,
    },
    author: {
      userId: dto.author.userId,
      nickname: dto.author.nickname,
      profileImageUrl: dto.author.profileImageUrl,
    },
    replyMetadata: {
      totalReplyCount: dto.replyMetadata.totalReplyCount,
      hasReplies: dto.replyMetadata.hasReplies,
    },
  };

  return ReviewCommentWithMetadataSchema.parse(entity);
}

/**
 * CreateReviewCommentResponse DTO → ReviewComment Entity
 */
export function createReviewCommentResponseToDomain(
  dto: CreateReviewCommentResponse,
): ReviewComment {
  if (!dto) {
    throw new Error("CreateReviewCommentResponse is null");
  }

  const entity = {
    commentId: dto.commentId,
    content: dto.content,
    commentStatus: dto.commentStatus,
    createdAt: dto.createdAt,
    // CreateReviewCommentResponse doesn't have updatedAt or isAuthor
  };

  return ReviewCommentSchema.parse(entity);
}

/**
 * CreateReviewRequest Entity → DTO
 */
export function createReviewRequestToDto(
  entity: CreateReviewRequest,
): CreateReviewRequestDTO {
  return CreateReviewRequestSchema.parse(entity) as CreateReviewRequestDTO;
}

/**
 * CreateReviewCommentRequest Entity → DTO
 */
export function createReviewCommentRequestToDto(
  entity: CreateReviewCommentRequest,
): CreateReviewCommentRequestDTO {
  return CreateReviewCommentRequestSchema.parse(
    entity,
  ) as CreateReviewCommentRequestDTO;
}

/**
 * Backward compatibility
 */
export const CafeteriaReviewMapper = {
  createReviewResponseToDomain,
  getReviewCommentResponseToDomain,
  createReviewCommentResponseToDomain,
  createReviewRequestToDto,
  createReviewCommentRequestToDto,
};
