import { useState } from "react";
import type { CafeteriaReviewReplyingTo } from "../types/comment";

export const useCafeteriaReviewCommentReply = () => {
  const [replyingTo, setReplyingTo] =
    useState<CafeteriaReviewReplyingTo | null>(null);

  const handleReplyClick = (commentId: string, username: string) => {
    // 같은 댓글을 다시 클릭하면 취소
    if (replyingTo?.commentId === commentId) {
      setReplyingTo(null);
    } else {
      setReplyingTo({ commentId, username });
    }
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  return {
    replyingTo,
    handleReplyClick,
    handleCancelReply,
  };
};
