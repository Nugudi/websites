/**
 * Cafeteria Review Repository Implementation
 *
 * DataSource를 통해 API 호출 수행 (Clean Architecture)
 * - DataSource에서 DTO 가져오기
 * - Mapper로 Entity 변환
 * - 에러 처리
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
      // Entity → DTO 변환
      const dto = createReviewRequestToDto(data);

      // DataSource에서 DTO 가져오기
      const response = await this.dataSource.createReview(dto);

      // Mapper로 Entity 변환
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
      // DataSource에서 DTO 가져오기
      const response = await this.dataSource.getReviewComments(
        reviewId,
        params,
      );

      // Mapper로 Entity 변환
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
      // Entity → DTO 변환
      const dto = createReviewCommentRequestToDto(data);

      // DataSource에서 DTO 가져오기
      const response = await this.dataSource.createReviewComment(reviewId, dto);

      // Mapper로 Entity 변환
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
      // Entity → DTO 변환
      const dto = createReviewCommentRequestToDto(data);

      // DataSource에서 DTO 가져오기
      const response = await this.dataSource.createReviewCommentReply(
        reviewId,
        commentId,
        dto,
      );

      // Mapper로 Entity 변환
      return createReviewCommentResponseToDomain(response);
    } catch (error) {
      throw this.handleError(error, "Failed to create review comment reply");
    }
  }

  /**
   * 에러 처리 헬퍼
   */
  private handleError(error: unknown, message: string): Error {
    if (error instanceof Error) {
      return new Error(`${message}: ${error.message}`);
    }
    return new Error(message);
  }
}
