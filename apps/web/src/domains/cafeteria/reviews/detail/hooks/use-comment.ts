import { useState } from "react";
import type { CafeteriaReviewReplyingTo } from "../types/comment";

/**
 * 댓글 대댓글 기능을 관리하는 통합 훅
 * @returns {Object} 댓글 대댓글 관련 상태와 핸들러
 * @returns {CafeteriaReviewReplyingTo | null} replyingTo - 현재 대댓글 작성 중인 댓글 정보
 * @returns {Function} handleSelectCommentForReply - 댓글에 대한 답글 작성 선택/취소
 * @returns {Function} handleCancelReply - 답글 작성 취소
 * @returns {Function} isCommentSelectedForReply - 특정 댓글이 답글 작성 대상인지 확인
 */
export const useCommentReply = () => {
  /** 현재 대댓글 작성 중인 댓글 정보 (null이면 일반 댓글 작성 모드) */
  const [replyingTo, setReplyingTo] =
    useState<CafeteriaReviewReplyingTo | null>(null);

  /**
   * 댓글에 대한 답글 작성을 선택하거나 취소
   * @param {string} commentId - 댓글 ID
   * @param {string} username - 댓글 작성자 이름
   */
  const handleSelectCommentForReply = (commentId: string, username: string) => {
    if (replyingTo?.commentId === commentId) {
      setReplyingTo(null);
    } else {
      setReplyingTo({ commentId, username });
    }
  };

  /**
   * 답글 작성 모드를 취소
   */
  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  /**
   * 특정 댓글이 현재 답글 작성 대상인지 확인
   * @param {string} commentId - 확인할 댓글 ID
   * @returns {boolean} 답글 작성 대상 여부
   */
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
