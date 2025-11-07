/**
 * Cafeteria Review Mapper
 */

// Import types from Domain Layer
import type {
  CreateReviewCommentRequest,
  CreateReviewRequest,
  Review,
  ReviewComment,
  ReviewCommentWithMetadata,
} from "../../domain/entities";
import type {
  CreateReviewCommentRequest as CreateReviewCommentRequestDTO,
  CreateReviewCommentResponse,
  CreateReviewRequest as CreateReviewRequestDTO,
  CreateReviewResponse,
  GetReviewCommentResponse,
} from "../dto";
// Import Zod schemas from Data Layer
import {
  CreateReviewRequestSchema,
  ReviewSchema,
} from "../dto/schemas/cafeteria-review.schema";
import {
  CreateReviewCommentRequestSchema,
  ReviewCommentSchema,
  ReviewCommentWithMetadataSchema,
} from "../dto/schemas/cafeteria-review-comment.schema";

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
  };

  return ReviewCommentSchema.parse(entity);
}

export function createReviewRequestToDto(
  entity: CreateReviewRequest,
): CreateReviewRequestDTO {
  return CreateReviewRequestSchema.parse(entity) as CreateReviewRequestDTO;
}

export function createReviewCommentRequestToDto(
  entity: CreateReviewCommentRequest,
): CreateReviewCommentRequestDTO {
  return CreateReviewCommentRequestSchema.parse(
    entity,
  ) as CreateReviewCommentRequestDTO;
}

export const CafeteriaReviewMapper = {
  createReviewResponseToDomain,
  getReviewCommentResponseToDomain,
  createReviewCommentResponseToDomain,
  createReviewRequestToDto,
  createReviewCommentRequestToDto,
};
