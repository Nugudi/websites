"use client";

import { Box, Flex, VStack } from "@nugudi/react-components-layout";
import { NavBar } from "@/src/shared/ui/components/nav-bar";
import { useCafeteriaReviewCommentReply } from "../../../hooks/useCafeteriaReviewCommentReply";
import { CafeteriaReviewCommentInputSection } from "../../sections/cafeteria-review-comment-input-section";
import { CafeteriaReviewCommentsSection } from "../../sections/cafeteria-review-comments-section";
import { CafeteriaReviewDetailSection } from "../../sections/cafeteria-review-detail-section";
import * as styles from "./index.css";

interface CafeteriaReviewDetailViewProps {
  reviewId: string;
}

export const CafeteriaReviewDetailView = ({
  reviewId,
}: CafeteriaReviewDetailViewProps) => {
  const { replyingTo, handleReplyClick, handleCancelReply } =
    useCafeteriaReviewCommentReply();

  return (
    <Flex direction="column" className={styles.container}>
      <Box className={styles.navBarWrapper} pt={16} pX={16}>
        <NavBar />
      </Box>

      <Box className={styles.content} pX={16}>
        <VStack gap={16}>
          <CafeteriaReviewDetailSection />
          <CafeteriaReviewCommentsSection
            replyingTo={replyingTo}
            onReplyClick={handleReplyClick}
          />
        </VStack>
      </Box>

      <CafeteriaReviewCommentInputSection
        reviewId={reviewId}
        replyingTo={replyingTo}
        onCancelReply={handleCancelReply}
      />
    </Flex>
  );
};
