import { MOCK_CAFETERIA_REVIEW_COMMENTS } from "../../../constants/mock-review";
import type { CafeteriaReviewReplyingTo } from "../../../types/comment";
import { CafeteriaReviewCommentList } from "../../components/cafeteria-review-comment-list";

interface CafeteriaReviewCommentsSectionProps {
  replyingTo: CafeteriaReviewReplyingTo | null;
  onReplyClick: (commentId: string, username: string) => void;
}

export const CafeteriaReviewCommentsSection = ({
  replyingTo,
  onReplyClick,
}: CafeteriaReviewCommentsSectionProps) => {
  const comments = MOCK_CAFETERIA_REVIEW_COMMENTS;

  return (
    <CafeteriaReviewCommentList
      comments={comments}
      replyingTo={replyingTo}
      onReplyClick={onReplyClick}
    />
  );
};
