"use client";

import { Backdrop } from "@nugudi/react-components-backdrop";
import { BottomSheet } from "@nugudi/react-components-bottom-sheet";
import { VStack } from "@nugudi/react-components-layout";
import { useState } from "react";
import type { CafeteriaReviewReplyingTo } from "../../../features/cafeteria-review-comment";
import { CafeteriaDateReviewsList } from "../../components/cafeteria-date-reviews-list";
import { CafeteriaReviewCommentInputSection } from "../cafeteria-review-comment-input-section";
import { CafeteriaReviewCommentsSection } from "../cafeteria-review-comments-section";

interface CafeteriaDateReviewsSectionProps {
  cafeteriaId: string;
  date: string;
}

export const CafeteriaDateReviewsSection = ({
  cafeteriaId,
  date,
}: CafeteriaDateReviewsSectionProps) => {
  const [_selectedReviewId, setSelectedReviewId] = useState<string | null>(
    null,
  );
  const [showCommentSheet, setShowCommentSheet] = useState(false);
  const [replyingTo, setReplyingTo] =
    useState<CafeteriaReviewReplyingTo | null>(null);

  const handleCommentClick = (reviewId: string) => {
    setSelectedReviewId(reviewId);
    setShowCommentSheet(true);
  };

  const handleCloseCommentSheet = () => {
    setShowCommentSheet(false);
    setSelectedReviewId(null);
    setReplyingTo(null);
  };

  const handleReplyClick = (commentId: string, username: string) => {
    setReplyingTo({ commentId, username });
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  return (
    <>
      <VStack gap={16} w={"100%"}>
        <CafeteriaDateReviewsList
          cafeteriaId={cafeteriaId}
          date={date}
          onCommentClick={handleCommentClick}
        />
      </VStack>

      {showCommentSheet && (
        <>
          <Backdrop onClick={handleCloseCommentSheet} />
          <BottomSheet
            isOpen={showCommentSheet}
            onClose={handleCloseCommentSheet}
            snapPoints={[70, 90]}
          >
            <VStack gap={0}>
              <CafeteriaReviewCommentsSection
                replyingTo={replyingTo}
                onReplyClick={handleReplyClick}
              />
              <CafeteriaReviewCommentInputSection
                replyingTo={replyingTo}
                onCancelReply={handleCancelReply}
              />
            </VStack>
          </BottomSheet>
        </>
      )}
    </>
  );
};
