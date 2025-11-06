/**
 * useGetReviewComments Query Hook
 *
 * 리뷰 댓글 조회를 위한 TanStack Query 커스텀 훅
 * - Client Container를 통한 UseCase 주입
 * - Domain Entity를 Presentation Type으로 변환
 * - Suspense/Error Boundary와 함께 사용
 */

"use client";

import type { ReviewCommentWithMetadata } from "@cafeteria/domain";
import { useQuery } from "@tanstack/react-query";
import { getCafeteriaClientContainer } from "../../../di/cafeteria-client-container";
import type { CafeteriaReviewCommentData } from "../../types";

/**
 * ISO 8601 날짜 → "~전" 형식 변환
 */
function formatTimeAgo(isoDate: string): string {
  const now = new Date();
  const date = new Date(isoDate);
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "방금 전";
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  if (diffDay < 7) return `${diffDay}일 전`;
  if (diffDay < 30) {
    const weeks = Math.floor(diffDay / 7);
    return `${weeks}주 전`;
  }
  if (diffDay < 365) {
    const months = Math.floor(diffDay / 30);
    return `${months}개월 전`;
  }
  const years = Math.floor(diffDay / 365);
  return `${years}년 전`;
}

/**
 * Domain Entity → Presentation Type 변환
 *
 * NOTE: 현재 Mock 구현에서는 replies를 빈 배열로 반환
 * 실제 API 통합 시 대댓글은 별도 API로 fetch해야 함
 */
function convertToPresentation(
  entity: ReviewCommentWithMetadata,
): CafeteriaReviewCommentData {
  return {
    id: String(entity.comment.commentId),
    username: entity.author.nickname,
    level: 1, // TODO: 실제 레벨 데이터는 User API에서 가져와야 함
    timeAgo: formatTimeAgo(entity.comment.createdAt),
    content: entity.comment.content,
    replies: [], // TODO: 대댓글은 별도 API로 가져와야 함
  };
}

/**
 * 리뷰 댓글 조회 Hook
 *
 * @param reviewId - 리뷰 ID (현재 Mock에서는 사용 안 함, 실제 API 통합 시 필요)
 * @param params - 페이지네이션 파라미터
 */
export function useGetReviewComments(
  reviewId: string = "1", // Mock용 기본값
  params: { cursor?: string; size?: number } = {},
) {
  // Client Container에서 UseCase 획득 (Lazy singleton)
  const container = getCafeteriaClientContainer();
  const getReviewCommentsUseCase = container.getGetReviewComments();

  // TanStack Query로 데이터 fetch
  return useQuery({
    queryKey: ["cafeteria", "reviews", reviewId, "comments", params],
    queryFn: async () => {
      const result = await getReviewCommentsUseCase.execute(reviewId, params);

      // Domain Entity → Presentation Type 변환
      return {
        comments: result.data.map((entity) => convertToPresentation(entity)),
        pageInfo: result.pageInfo,
      };
    },
  });
}
