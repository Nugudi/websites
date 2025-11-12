"use client";

import { useCommentReply } from "@cafeteria/presentation/client/hooks";
import { Backdrop } from "@nugudi/react-components-backdrop";
import { BottomSheet } from "@nugudi/react-components-bottom-sheet";
import { Box, VStack } from "@nugudi/react-components-layout";
import { CafeteriaReviewCommentInputSection } from "../../sections/cafeteria-review-comment-input-section";
import { CafeteriaReviewCommentsSection } from "../../sections/cafeteria-review-comments-section";
import * as styles from "./index.css";

interface CafeteriaReviewCommentBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CafeteriaReviewCommentBottomSheet = ({
  isOpen,
  onClose,
}: CafeteriaReviewCommentBottomSheetProps) => {
  const { replyingTo, handleSelectCommentForReply, handleCancelReply } =
    useCommentReply();

  const handleClose = () => {
    handleCancelReply();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <Backdrop onClick={handleClose} />
      <BottomSheet isOpen={isOpen} onClose={handleClose} snapPoints={[70, 90]}>
        <VStack gap={0} height="100%">
          <Box className={styles.commentsContainer}>
            <CafeteriaReviewCommentsSection
              replyingTo={replyingTo}
              onReplyClick={handleSelectCommentForReply}
            />
          </Box>
          <CafeteriaReviewCommentInputSection
            replyingTo={replyingTo}
            onCancelReply={handleCancelReply}
          />
        </VStack>
      </BottomSheet>
    </>
  );
};
