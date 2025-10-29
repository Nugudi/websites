"use client";

import { Box, Flex, VStack } from "@nugudi/react-components-layout";
import { NavBar } from "@/src/shared/interface-adapters/components/nav-bar";
import { useCommentReply } from "../../../hooks/use-comment";
import { CafeteriaReviewCommentInputSection } from "../../sections/cafeteria-review-comment-input-section";
import { CafeteriaReviewCommentsSection } from "../../sections/cafeteria-review-comments-section";
import { CafeteriaReviewDetailSection } from "../../sections/cafeteria-review-detail-section";
import * as styles from "./index.css";

export const CafeteriaReviewDetailView = () => {
  const { replyingTo, handleSelectCommentForReply, handleCancelReply } =
    useCommentReply();

  return (
    <Flex direction="column" h={"100dvh"}>
      <NavBar />

      <Box className={styles.content} pX={16}>
        <VStack gap={16}>
          <CafeteriaReviewDetailSection />
          <CafeteriaReviewCommentsSection
            replyingTo={replyingTo}
            onReplyClick={handleSelectCommentForReply}
          />
        </VStack>
      </Box>

      <CafeteriaReviewCommentInputSection
        replyingTo={replyingTo}
        onCancelReply={handleCancelReply}
      />
    </Flex>
  );
};
