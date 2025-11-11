"use client";

import type { ReviewCommentWithMetadata } from "@cafeteria/domain";
import type { CafeteriaReviewCommentData } from "@cafeteria/presentation/shared/types";
import { formatRelativeTime } from "@core/utils";
import { useQuery } from "@tanstack/react-query";
import { getCafeteriaClientContainer } from "@/src/domains/cafeteria/di/cafeteria-client-container";

function convertToPresentation(
  entity: ReviewCommentWithMetadata,
): CafeteriaReviewCommentData {
  return {
    id: String(entity.comment.commentId),
    username: entity.author.nickname,
    level: 1,
    timeAgo: formatRelativeTime(entity.comment.createdAt, {
      detail: "detailed",
    }),
    content: entity.comment.content,
    replies: [],
  };
}

export function useGetReviewComments(
  reviewId: string = "1",
  params: { cursor?: string; size?: number } = {},
) {
  const container = getCafeteriaClientContainer();
  const getReviewCommentsUseCase = container.getGetReviewComments();

  return useQuery({
    queryKey: ["cafeteria", "reviews", reviewId, "comments", params],
    queryFn: async () => {
      const result = await getReviewCommentsUseCase.execute(reviewId, params);

      return {
        comments: result.data.map((entity) => convertToPresentation(entity)),
        pageInfo: result.pageInfo,
      };
    },
  });
}
