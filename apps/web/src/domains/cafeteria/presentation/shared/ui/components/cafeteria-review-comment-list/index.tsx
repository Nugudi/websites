"use client";

import type {
  CafeteriaReviewCommentData,
  CafeteriaReviewReplyingTo,
} from "@cafeteria/presentation/shared/types";
import { Avatar } from "@nugudi/react-components-avatar";
import { Button } from "@nugudi/react-components-button";
import { Comment } from "@nugudi/react-components-comment";
import { VStack } from "@nugudi/react-components-layout";
import { useCallback, useState } from "react";
import * as styles from "./index.css";

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
    <VStack gap={16}>
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
  const [showReplies, setShowReplies] = useState(false);
  const isSelectedForReply = !isReply && replyingTo?.commentId === comment.id;

  const handleReplyClick = useCallback(() => {
    onReplyClick?.(comment.id, comment.username);
  }, [onReplyClick, comment.id, comment.username]);

  const handleToggleReplies = () => {
    setShowReplies(!showReplies);
  };

  const replies = comment.replies || [];
  const hasReplies = replies.length > 0;

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
      {hasReplies && !isReply && (
        <Button
          size="sm"
          className={styles.showRepliesButton}
          onClick={handleToggleReplies}
        >
          {showReplies ? "답글 숨기기" : `답글 보기(${replies.length}개)`}
        </Button>
      )}

      {showReplies && (
        <VStack gap={16}>
          {replies.map((reply) => (
            <CafeteriaReviewCommentItem
              key={reply.id}
              comment={reply}
              replyingTo={null}
              isReply={true}
            />
          ))}
        </VStack>
      )}
    </Comment>
  );
};
