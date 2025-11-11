"use client";

import type { CafeteriaReviewReplyingTo } from "@cafeteria/presentation";
import { ArrowUpCircleIcon } from "@nugudi/assets-icons";
import { Avatar } from "@nugudi/react-components-avatar";
import { Input } from "@nugudi/react-components-input";
import { Flex, HStack } from "@nugudi/react-components-layout";
import { useForm } from "react-hook-form";
import { CafeteriaReviewReplyIndicator } from "../../components/cafeteria-review-reply-indicator";
import * as styles from "./index.css";

interface CafeteriaReviewCommentInputSectionProps {
  replyingTo: CafeteriaReviewReplyingTo | null;
  onCancelReply: () => void;
}

interface CommentFormData {
  comment: string;
}

export const CafeteriaReviewCommentInputSection = ({
  replyingTo,
  onCancelReply,
}: CafeteriaReviewCommentInputSectionProps) => {
  const { register, handleSubmit, reset, watch } = useForm<CommentFormData>({
    defaultValues: {
      comment: "",
    },
  });

  const commentValue = watch("comment");

  const onSubmit = (data: CommentFormData) => {
    if (data.comment.trim()) {
      if (replyingTo) {
        // 대댓글 작성
      } else {
        // 일반 댓글 작성
      }

      reset();
      onCancelReply();
    }
  };

  return (
    <Flex
      direction="column"
      align="center"
      gap={8}
      w="100%"
      className={styles.inputWrapper}
    >
      {replyingTo && (
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
              aria-label={replyingTo ? "답글 전송" : "댓글 전송"}
            >
              <ArrowUpCircleIcon
                width={30}
                height={30}
                className={
                  commentValue?.trim() ? styles.activeIcon : styles.disabledIcon
                }
              />
            </button>
          }
        />
      </HStack>
    </Flex>
  );
};
