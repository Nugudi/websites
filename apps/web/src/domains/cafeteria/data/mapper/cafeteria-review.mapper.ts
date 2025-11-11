/**
 * Cafeteria Review Mapper
 */

// Import Entity classes from Domain Layer
import {
  type Review,
  type ReviewComment,
  ReviewCommentEntity,
  ReviewEntity,
} from "../../domain/entities";
// Import DTO types from Data Layer
import type {
  CreateReviewCommentRequest,
  CreateReviewCommentResponse,
  CreateReviewRequest,
  CreateReviewResponse,
  GetReviewCommentResponse,
} from "../remote/dto";
// Import Domain Types (simple data structures from DTO layer)
import type { ReviewCommentWithMetadata } from "../remote/dto/response/cafeteria-review-types";

// Import Zod schemas from Data Layer
import {
  CreateReviewRequestSchema,
  ReviewSchema,
} from "../remote/dto/response/schemas/cafeteria-review.schema";
import {
  CreateReviewCommentRequestSchema,
  ReviewCommentSchema,
  ReviewCommentWithMetadataSchema,
} from "../remote/dto/response/schemas/cafeteria-review-comment.schema";

export function createReviewResponseToDomain(
  dto: CreateReviewResponse,
): Review {
  if (!dto) {
    throw new Error("CreateReviewResponse is null");
  }

  // Validate with Zod schema first
  const validated = ReviewSchema.parse({
    id: dto.reviewId,
    restaurantId: dto.restaurantId,
    reviewDate: dto.reviewDate,
    mealType: dto.mealType,
    tasteTypeId: dto.tasteTypeId,
    content: dto.content,
    mainImageUrl: dto.mainImageUrl,
    likeCount: dto.likeCount,
    createdAt: dto.createdAt,
  });

  // Return Entity instance
  return new ReviewEntity(validated);
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

  // Validate with Zod schema first
  // Note: CreateReviewCommentResponse doesn't include updatedAt and isAuthor
  // These fields are only available in GetReviewCommentResponse
  const validated = ReviewCommentSchema.parse({
    commentId: dto.commentId,
    content: dto.content,
    commentStatus: dto.commentStatus,
    createdAt: dto.createdAt,
    updatedAt: undefined, // Not provided in create response
    isAuthor: true, // User is author when creating their own comment
  });

  // Return Entity instance
  return new ReviewCommentEntity(validated);
}

export function createReviewRequestToDto(
  entity: CreateReviewRequest,
): CreateReviewRequest {
  return CreateReviewRequestSchema.parse(entity);
}

export function createReviewCommentRequestToDto(
  entity: CreateReviewCommentRequest,
): CreateReviewCommentRequest {
  return CreateReviewCommentRequestSchema.parse(entity);
}

export const CafeteriaReviewMapper = {
  createReviewResponseToDomain,
  getReviewCommentResponseToDomain,
  createReviewCommentResponseToDomain,
  createReviewRequestToDto,
  createReviewCommentRequestToDto,
};
