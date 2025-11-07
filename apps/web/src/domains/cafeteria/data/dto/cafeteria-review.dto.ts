/**
 * Cafeteria Review DTO
 */

import type { components } from "@nugudi/types";

// ==========================================
// Review Entity Types
// ==========================================

/**
 * TODO: OpenAPI 스키마에 ReviewInfo가 추가되면 활성화
 * 리뷰 정보
 * - 리뷰 기본 정보 (ID, 내용, 이미지, 평가 등)
 */
// export type ReviewInfo = components["schemas"]["ReviewInfo"];

/**
 * TODO: OpenAPI 스키마에 ReviewerInfo가 추가되면 활성화
 * 리뷰 작성자 정보
 * - 작성자 프로필 정보
 */
// export type ReviewerInfo = components["schemas"]["ReviewerInfo"];

// ==========================================
// Comment Entity Types
// ==========================================

/**
 * TODO: OpenAPI 스키마에 추가되면 활성화
 * 댓글 정보
 * - 댓글 기본 정보 (ID, 내용, 상태 등)
 */
// export type CommentInfo = components["schemas"]["CommentInfo"];

/**
 * TODO: OpenAPI 스키마에 추가되면 활성화
 * 작성자 정보
 * - 댓글/대댓글 작성자 정보
 */
// export type AuthorInfo = components["schemas"]["AuthorInfo"];

/**
 * TODO: OpenAPI 스키마에 추가되면 활성화
 * 대댓글 메타 정보
 * - 대댓글 개수 및 존재 여부
 */
// export type ReplyMetadata = components["schemas"]["ReplyMetadata"];

/**
 * TODO: OpenAPI 스키마에 추가되면 활성화
 * 대댓글 정보
 * - 대댓글 상세 정보
 */
// export type ReplyInfo = components["schemas"]["ReplyInfo"];

// ==========================================
// API Request Types
// ==========================================

/**
 * 리뷰 작성 요청
 */
export type CreateReviewRequest = components["schemas"]["CreateReviewRequest"];

/**
 * 리뷰 댓글 작성 요청
 */
export type CreateReviewCommentRequest =
  components["schemas"]["CreateReviewCommentRequest"];

/**
 * 리뷰 댓글 수정 요청
 */
export type UpdateReviewCommentRequest =
  components["schemas"]["UpdateReviewCommentRequest"];

// ==========================================
// API Response Types
// ==========================================

/**
 * 리뷰 작성 응답
 */
export type CreateReviewResponse =
  components["schemas"]["CreateReviewResponse"];

/**
 * 리뷰 댓글 조회 응답
 */
export type GetReviewCommentResponse =
  components["schemas"]["GetReviewCommentResponse"];

/**
 * 리뷰 댓글 작성 응답
 */
export type CreateReviewCommentResponse =
  components["schemas"]["CreateReviewCommentResponse"];

/**
 * 리뷰 댓글 수정 응답
 */
export type UpdateReviewCommentResponse =
  components["schemas"]["UpdateReviewCommentResponse"];

/**
 * 리뷰 댓글 삭제 응답
 */
export type DeleteReviewCommentResponse =
  components["schemas"]["DeleteReviewCommentResponse"];

// ==========================================
// Wrapped Response Types (TanStack Query용)
// ==========================================

/**
 * 리뷰 작성 성공 응답
 */
export type SuccessResponseCreateReviewResponse =
  components["schemas"]["SuccessResponseCreateReviewResponse"];

/**
 * 리뷰 댓글 조회 페이지 응답 (무한 스크롤)
 */
export type PageResponseGetReviewCommentResponse =
  components["schemas"]["PageResponseGetReviewCommentResponse"];

/**
 * 리뷰 댓글 작성 성공 응답
 */
export type SuccessResponseCreateReviewCommentResponse =
  components["schemas"]["SuccessResponseCreateReviewCommentResponse"];

/**
 * TODO: OpenAPI 스키마에 추가되면 활성화
 * 리뷰 댓글 수정 성공 응답
 */
// export type SuccessResponseUpdateReviewCommentResponse =
//   components["schemas"]["SuccessResponseUpdateReviewCommentResponse"];

/**
 * TODO: OpenAPI 스키마에 추가되면 활성화
 * 리뷰 댓글 삭제 성공 응답
 */
// export type SuccessResponseDeleteReviewCommentResponse =
//   components["schemas"]["SuccessResponseDeleteReviewCommentResponse"];

/**
 * TODO: OpenAPI 스키마에 추가되면 활성화
 * 대댓글 조회 페이지 응답 (무한 스크롤)
 */
// export type PageResponseReplyInfo =
//   components["schemas"]["PageResponseReplyInfo"];

// ==========================================
// Temporary DTO Types (TODO: Replace with OpenAPI types)
// ==========================================

/**
 * 리뷰 댓글 DTO (임시 - OpenAPI 스키마 추가 시 교체)
 * TODO: OpenAPI 스키마에 ReviewCommentDto 추가되면 위의 주석 처리된 타입으로 교체
 */
export interface ReviewCommentDto {
  id: string;
  username: string;
  level: number;
  time_ago: string; // API 규칙: snake_case
  content: string;
  replies?: ReviewCommentDto[];
}

// ==========================================
// NOTE: PageInfo is exported from cafeteria.type.ts (shared type)
// ==========================================
// Operations Types (API 엔드포인트 타입)
// ==========================================

/**
 * TODO: OpenAPI operations에 추가되면 활성화
 * POST /api/v1/reviews - 리뷰 작성
 */
// export type CreateReviewOperation = operations["createReview"];

/**
 * TODO: OpenAPI operations에 추가되면 활성화
 * GET /api/v1/reviews/{reviewId}/comments - 리뷰 댓글 조회 (무한 스크롤)
 */
// export type GetReviewCommentsOperation = operations["getReviewComments"];

/**
 * TODO: OpenAPI operations에 추가되면 활성화
 * POST /api/v1/reviews/{reviewId}/comments - 리뷰 댓글 작성
 */
// export type CreateReviewCommentOperation = operations["createReviewComment"];

/**
 * TODO: OpenAPI operations에 추가되면 활성화
 * PATCH /api/v1/comments/{commentId} - 댓글 수정
 */
// export type UpdateCommentOperation = operations["updateComment"];

/**
 * TODO: OpenAPI operations에 추가되면 활성화
 * DELETE /api/v1/comments/{commentId} - 댓글 삭제
 */
// export type DeleteCommentOperation = operations["deleteComment"];

/**
 * TODO: OpenAPI operations에 추가되면 활성화
 * GET /api/v1/comments/{commentId}/replies - 대댓글 조회 (무한 스크롤)
 */
// export type GetRepliesOperation = operations["getReplies"];

/**
 * TODO: OpenAPI operations에 추가되면 활성화
 * POST /api/v1/reviews/{reviewId}/comments - 대댓글 작성 (parentCommentId 포함)
 * NOTE: 대댓글 작성도 createReviewComment operation 사용, parentCommentId로 구분
 */
// export type CreateReplyOperation = operations["createReviewComment"];
