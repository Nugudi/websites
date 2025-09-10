"use client";

import { ArrowUpCircleIcon } from "@nugudi/assets-icons";
import { Avatar } from "@nugudi/react-components-avatar";
import { Input } from "@nugudi/react-components-input";
import { Flex, HStack } from "@nugudi/react-components-layout";
import { useForm } from "react-hook-form";
import type { CafeteriaReviewReplyingTo } from "../../../types/comment";
import { CafeteriaReviewReplyIndicator } from "../../components/cafeteria-review-reply-indicator";
import * as styles from "./index.css";

interface CafeteriaReviewCommentInputSectionProps {
  reviewId: string;
  replyingTo?: CafeteriaReviewReplyingTo | null;
  onCancelReply?: () => void;
}

interface CommentFormData {
  comment: string;
}

export const CafeteriaReviewCommentInputSection = ({
  reviewId,
  replyingTo,
  onCancelReply,
}: CafeteriaReviewCommentInputSectionProps) => {
  const { register, handleSubmit, reset, watch } = useForm<CommentFormData>({
    defaultValues: {
      comment: "",
    },
  });

  const commentValue = watch("comment");

  const getSubmitIconClassName = (value: string | undefined): string => {
    const hasContent = value?.trim();
    return hasContent ? styles.activeIcon : styles.disabledIcon;
  };

  const onSubmit = (data: CommentFormData) => {
    if (data.comment.trim()) {
      if (replyingTo) {
        // 답글 제출
        console.log("답글 제출:", {
          reviewId,
          parentCommentId: replyingTo.commentId,
          content: data.comment,
          replyTo: replyingTo.username,
        });
      } else {
        // 일반 댓글 제출
        console.log("댓글 제출:", {
          reviewId,
          content: data.comment,
        });
      }

      reset();
      onCancelReply?.();
    }
  };

  return (
    <Flex
      direction="column"
      align="center"
      gap={8}
      w="100%"
      p={16}
      className={styles.inputWrapper}
    >
      {replyingTo && onCancelReply && (
        <CafeteriaReviewReplyIndicator
          username={replyingTo.username}
          onCancel={onCancelReply}
        />
      )}

      <HStack
        w={"100%"}
        align="center"
        gap={8}
        as="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Avatar size="xs" />
        <Input
          {...register("comment", { required: true })}
          variant="filled"
          placeholder={replyingTo ? "답글을 입력하세요" : "댓글을 입력하세요"}
          rightIcon={
            <button
              className={styles.buttonBox}
              type="submit"
              disabled={!commentValue?.trim()}
            >
              <ArrowUpCircleIcon
                width={30}
                height={30}
                className={getSubmitIconClassName(commentValue)}
              />
            </button>
          }
        />
      </HStack>
    </Flex>
  );
};
