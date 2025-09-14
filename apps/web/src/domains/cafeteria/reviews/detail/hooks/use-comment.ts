import { useState } from "react";
import type { CafeteriaReviewReplyingTo } from "../types/comment";

/**
 * 댓글 대댓글 기능을 관리하는 통합 훅
 */
export const useCommentReply = () => {
  // 현재 대댓글  작성 중인 댓글 정보 (null이면 일반 댓글 작성 모드)
  const [replyingTo, setReplyingTo] =
    useState<CafeteriaReviewReplyingTo | null>(null);

  const handleSelectCommentForReply = (commentId: string, username: string) => {
    if (replyingTo?.commentId === commentId) {
      setReplyingTo(null);
    } else {
      setReplyingTo({ commentId, username });
    }
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  const isCommentSelectedForReply = (commentId: string) => {
    return replyingTo?.commentId === commentId;
  };

  return {
    replyingTo,
    handleSelectCommentForReply,
    handleCancelReply,
    isCommentSelectedForReply,
  };
};
