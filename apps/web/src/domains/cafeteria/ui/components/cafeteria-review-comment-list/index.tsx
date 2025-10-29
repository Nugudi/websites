"use client";

import { Avatar } from "@nugudi/react-components-avatar";
import { Comment } from "@nugudi/react-components-comment";
import { VStack } from "@nugudi/react-components-layout";
import { useCallback } from "react";
import type {
  CafeteriaReviewCommentData,
  CafeteriaReviewReplyingTo,
} from "../../../features/cafeteria-review-comment";

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

interface CafeteriaReviewCommentItemProps {
  comment: CafeteriaReviewCommentData;
  replyingTo: CafeteriaReviewReplyingTo | null;
  onReplyClick?: (commentId: string, username: string) => void;
  isReply?: boolean;
}

const CafeteriaReviewCommentItem = ({
  comment,
  replyingTo,
  onReplyClick,
  isReply = false,
}: CafeteriaReviewCommentItemProps) => {
  const isSelectedForReply = !isReply && replyingTo?.commentId === comment.id;

  const handleReplyClick = useCallback(() => {
    onReplyClick?.(comment.id, comment.username);
  }, [onReplyClick, comment.id, comment.username]);

  return (
    <Comment
      avatar={<Avatar alt={comment.username} size="xs" />}
      username={comment.username}
      level={comment.level}
      timeAgo={comment.timeAgo}
      content={comment.content}
      showReplyButton={!isReply}
      onReplyClick={handleReplyClick}
      isHighlighted={isSelectedForReply}
      isReply={isReply}
    >
      {comment.replies?.map((reply) => (
        <CafeteriaReviewCommentItem
          key={reply.id}
          comment={reply}
          replyingTo={null}
          isReply={true}
        />
      ))}
    </Comment>
  );
};
