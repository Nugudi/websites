/**
 * Cafeteria Review Repository Implementation
 *
 * Data Layer의 Repository 구현
 *
 * @remarks
 * - Domain Repository 인터페이스 구현
 * - DataSource를 통한 데이터 조회
 * - DTO → Entity 변환 (Mapper 사용)
 * - CafeteriaError 사용
 * - Clean Architecture: Data Layer
 */

import type { PageInfo } from "@core/types";
// Import Entity classes from Domain Layer
import type { Review, ReviewComment } from "../../../domain/entities";
import {
  CAFETERIA_ERROR_CODES,
  CafeteriaError,
} from "../../../domain/errors/cafeteria-error";
import type { CafeteriaReviewRepository } from "../../../domain/repositories";
import { pageInfoDtoToDomain } from "../../mapper/cafeteria.mapper";
import {
  createReviewCommentRequestToDto,
  createReviewCommentResponseToDomain,
  createReviewRequestToDto,
  createReviewResponseToDomain,
  getReviewCommentResponseToDomain,
} from "../../mapper/cafeteria-review.mapper";
// Import Request DTOs
import type {
  CreateReviewCommentRequest as CreateReviewCommentRequestEntity,
  CreateReviewRequest as CreateReviewRequestEntity,
} from "../../remote/dto";
// Import Domain Types (simple data structures from DTO layer)
import type { ReviewCommentWithMetadata } from "../../remote/dto/response/cafeteria-review-types";
import type { CafeteriaReviewRemoteDataSource } from "../datasource/cafeteria-review-remote-data-source";

export class CafeteriaReviewRepositoryImpl
  implements CafeteriaReviewRepository
{
  constructor(private readonly dataSource: CafeteriaReviewRemoteDataSource) {}

  async createReview(data: CreateReviewRequestEntity): Promise<Review> {
    try {
      const dto = createReviewRequestToDto(data);
      const response = await this.dataSource.createReview(dto);
      return createReviewResponseToDomain(response);
    } catch (error) {
      if (error instanceof CafeteriaError) {
        throw error;
      }

      throw new CafeteriaError(
        "Failed to create review",
        CAFETERIA_ERROR_CODES.REVIEW_FETCH_FAILED,
        error,
      );
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
      if (error instanceof CafeteriaError) {
        throw error;
      }

      throw new CafeteriaError(
        "Failed to fetch review comments",
        CAFETERIA_ERROR_CODES.REVIEW_FETCH_FAILED,
        error,
      );
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
      if (error instanceof CafeteriaError) {
        throw error;
      }

      throw new CafeteriaError(
        "Failed to create review comment",
        CAFETERIA_ERROR_CODES.REVIEW_FETCH_FAILED,
        error,
      );
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
      if (error instanceof CafeteriaError) {
        throw error;
      }

      throw new CafeteriaError(
        "Failed to create review comment reply",
        CAFETERIA_ERROR_CODES.REVIEW_FETCH_FAILED,
        error,
      );
    }
  }
}
