"use client";

import { ArrowUpCircleIcon } from "@nugudi/assets-icons";
import { Avatar } from "@nugudi/react-components-avatar";
import { Input } from "@nugudi/react-components-input";
import { HStack } from "@nugudi/react-components-layout";
import { useState } from "react";

interface CafeteriaReviewCommentInputSectionProps {
  reviewId: string;
}

export const CafeteriaReviewCommentInputSection = ({
  reviewId,
}: CafeteriaReviewCommentInputSectionProps) => {
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      // Mock submit action
      console.log("Submitting comment:", comment);
      setComment("");
    }
  };

  return (
    <HStack align="center" gap={8} as="form" onSubmit={handleSubmit}>
      <Avatar size="xs" />
      <Input
        variant="filled"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="댓글을 입력하세요"
        rightIcon={<ArrowUpCircleIcon width={30} height={30} />}
      />
    </HStack>
  );
};
