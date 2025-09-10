"use client";

import { Avatar } from "@nugudi/react-components-avatar";
import { Comment } from "@nugudi/react-components-comment";
import { VStack } from "@nugudi/react-components-layout";
import type {
  CafeteriaReviewCommentData,
  CafeteriaReviewReplyingTo,
} from "../../../types/comment";

interface CafeteriaReviewCommentListProps {
  comments: CafeteriaReviewCommentData[];
  replyingTo: CafeteriaReviewReplyingTo | null;
  onReplyClick: (commentId: string, username: string) => void;
}

export const CafeteriaReviewCommentList = ({
  comments,
  replyingTo,
  onReplyClick,
}: CafeteriaReviewCommentListProps) => {
  return (
    <VStack>
      {comments.map((comment) => (
        <CafeteriaReviewCommentItem
          key={comment.id}
          comment={comment}
          replyingTo={replyingTo}
          onReplyClick={onReplyClick}
        />
      ))}
    </VStack>
  );
};

// --- comment item ---
interface CafeteriaReviewCommentItemProps {
  comment: CafeteriaReviewCommentData;
  replyingTo?: CafeteriaReviewReplyingTo | null;
  onReplyClick?: (commentId: string, username: string) => void;
  isReply?: boolean;
}

const CafeteriaReviewCommentItem = ({
  comment,
  replyingTo,
  onReplyClick,
  isReply = false,
}: CafeteriaReviewCommentItemProps) => {
  // 답글 버튼 표시 여부 (답글에는 답글 버튼 없음)
  const shouldShowReplyButton = () => {
    return !isReply;
  };

  // 현재 댓글에 답글을 작성 중인지 확인
  const isCurrentlyReplyingTo = () => {
    if (isReply) return false;
    return replyingTo?.commentId === comment.id;
  };

  // 답글 클릭 핸들러 생성
  const createReplyClickHandler = () => {
    if (!onReplyClick) return undefined;
    return () => onReplyClick(comment.id, comment.username);
  };

  return (
    <Comment
      avatar={<Avatar alt={comment.username} size="xs" />}
      username={comment.username}
      level={comment.level}
      timeAgo={comment.timeAgo}
      content={comment.content}
      showReplyButton={shouldShowReplyButton()}
      onReplyClick={createReplyClickHandler()}
      isHighlighted={isCurrentlyReplyingTo()}
      isReply={isReply}
    >
      {comment.replies?.map((reply) => (
        <CafeteriaReviewCommentItem
          key={reply.id}
          comment={reply}
          isReply={true}
        />
      ))}
    </Comment>
  );
};
