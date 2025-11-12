"use client";

import type { CafeteriaReviewReplyingTo } from "@cafeteria/presentation";
import { useGetReviewComments } from "@/src/domains/cafeteria/presentation/client/hooks/queries/get-review-comments.query";
import { CafeteriaReviewCommentList } from "../../components/cafeteria-review-comment-list";

interface CafeteriaReviewCommentsSectionProps {
  replyingTo: CafeteriaReviewReplyingTo | null;
  onReplyClick: (commentId: string, username: string) => void;
}

export const CafeteriaReviewCommentsSection = ({
  replyingTo,
  onReplyClick,
}: CafeteriaReviewCommentsSectionProps) => {
  // UseCase를 통한 데이터 fetch (Clean Architecture)
  const { data, isLoading, error } = useGetReviewComments();

  // Loading state
  if (isLoading) {
    return <div>댓글을 불러오는 중...</div>;
  }

  // Error state
  if (error) {
    return <div>댓글을 불러오는 중 오류가 발생했습니다.</div>;
  }

  const comments = data?.comments ?? [];

  return (
    <CafeteriaReviewCommentList
      comments={comments}
      replyingTo={replyingTo}
      onReplyClick={onReplyClick}
    />
  );
};
