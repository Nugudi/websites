/**
 * Cafeteria Review Repository Implementation
 *
 * DataSource를 통해 API 호출 수행 (Clean Architecture)
 * - DataSource에서 DTO 가져오기
 * - 필요시 Mapper로 Entity 변환
 * - 에러 처리
 */

import type { CafeteriaReviewRepository } from "../../domain/repositories";
import type { CafeteriaReviewRemoteDataSource } from "../data-sources";
import type {
  CreateReviewCommentRequest,
  CreateReviewCommentResponse,
  CreateReviewRequest,
  CreateReviewResponse,
  GetReviewCommentResponse,
  PageInfo,
} from "../dto";

export class CafeteriaReviewRepositoryImpl
  implements CafeteriaReviewRepository
{
  constructor(private readonly dataSource: CafeteriaReviewRemoteDataSource) {}

  async createReview(data: CreateReviewRequest): Promise<CreateReviewResponse> {
    try {
      // DataSource에서 DTO 가져오기
      return await this.dataSource.createReview(data);
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
    data: GetReviewCommentResponse[];
    pageInfo: PageInfo;
  }> {
    try {
      // DataSource에서 DTO 가져오기
      return await this.dataSource.getReviewComments(reviewId, params);
    } catch (error) {
      throw this.handleError(error, "Failed to fetch review comments");
    }
  }

  async createReviewComment(
    reviewId: string,
    data: CreateReviewCommentRequest,
  ): Promise<CreateReviewCommentResponse> {
    try {
      // DataSource에서 DTO 가져오기
      return await this.dataSource.createReviewComment(reviewId, data);
    } catch (error) {
      throw this.handleError(error, "Failed to create review comment");
    }
  }

  async createReviewCommentReply(
    reviewId: string,
    commentId: string,
    data: CreateReviewCommentRequest,
  ): Promise<CreateReviewCommentResponse> {
    try {
      // DataSource에서 DTO 가져오기
      return await this.dataSource.createReviewCommentReply(
        reviewId,
        commentId,
        data,
      );
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
