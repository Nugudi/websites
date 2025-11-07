/**
 * Cafeteria Review Repository Implementation
 */

import type { PageInfo } from "@shared/domain/entities";
import type {
  CreateReviewCommentRequest as CreateReviewCommentRequestEntity,
  CreateReviewRequest as CreateReviewRequestEntity,
  Review,
  ReviewComment,
  ReviewCommentWithMetadata,
} from "../../domain/entities";
import type { CafeteriaReviewRepository } from "../../domain/repositories";
import type { CafeteriaReviewDataSource } from "../data-sources";
import {
  createReviewCommentRequestToDto,
  createReviewCommentResponseToDomain,
  createReviewRequestToDto,
  createReviewResponseToDomain,
  getReviewCommentResponseToDomain,
  pageInfoDtoToDomain,
} from "../mappers";

export class CafeteriaReviewRepositoryImpl
  implements CafeteriaReviewRepository
{
  constructor(private readonly dataSource: CafeteriaReviewDataSource) {}

  async createReview(data: CreateReviewRequestEntity): Promise<Review> {
    try {
      const dto = createReviewRequestToDto(data);
      const response = await this.dataSource.createReview(dto);
      return createReviewResponseToDomain(response);
    } catch (error) {
      throw this.handleError(error, "Failed to create review");
    }
  }

  async getReviewComments(
    reviewId: string,
    params: {
      cursor?: string;
      size?: number;
    },
  ): Promise<{
    data: ReviewCommentWithMetadata[];
    pageInfo: PageInfo;
  }> {
    try {
      const response = await this.dataSource.getReviewComments(
        reviewId,
        params,
      );

      return {
        data: response.data.map((dto) => getReviewCommentResponseToDomain(dto)),
        pageInfo: pageInfoDtoToDomain(response.pageInfo),
      };
    } catch (error) {
      throw this.handleError(error, "Failed to fetch review comments");
    }
  }

  async createReviewComment(
    reviewId: string,
    data: CreateReviewCommentRequestEntity,
  ): Promise<ReviewComment> {
    try {
      const dto = createReviewCommentRequestToDto(data);
      const response = await this.dataSource.createReviewComment(reviewId, dto);
      return createReviewCommentResponseToDomain(response);
    } catch (error) {
      throw this.handleError(error, "Failed to create review comment");
    }
  }

  async createReviewCommentReply(
    reviewId: string,
    commentId: string,
    data: CreateReviewCommentRequestEntity,
  ): Promise<ReviewComment> {
    try {
      const dto = createReviewCommentRequestToDto(data);
      const response = await this.dataSource.createReviewCommentReply(
        reviewId,
        commentId,
        dto,
      );
      return createReviewCommentResponseToDomain(response);
    } catch (error) {
      throw this.handleError(error, "Failed to create review comment reply");
    }
  }

  private handleError(error: unknown, message: string): Error {
    if (error instanceof Error) {
      return new Error(`${message}: ${error.message}`);
    }
    return new Error(message);
  }
}
