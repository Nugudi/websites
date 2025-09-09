import { Box, Divider, Flex, VStack } from "@nugudi/react-components-layout";
import { NavBar } from "@/src/shared/ui/components/nav-bar";
import { CafeteriaReviewCommentInputSection } from "../../sections/cafeteria-review-comment-input-section";
import { CafeteriaReviewCommentsSection } from "../../sections/cafeteria-review-comments-section";
import { CafeteriaReviewDetailSection } from "../../sections/cafeteria-review-detail-section";
import * as styles from "./index.css";

interface CafeteriaReviewDetailViewProps {
  cafeteriaId: string;
  reviewId: string;
}

export const CafeteriaReviewDetailView = ({
  cafeteriaId,
  reviewId,
}: CafeteriaReviewDetailViewProps) => {
  return (
    <Flex className={styles.container} pX={16}>
      <Box className={styles.navBarWrapper} pt={16}>
        <NavBar />
      </Box>

      <Box className={styles.content}>
        <VStack gap={16}>
          <CafeteriaReviewDetailSection
            cafeteriaId={cafeteriaId}
            reviewId={reviewId}
          />
          <Divider />
          <CafeteriaReviewCommentsSection reviewId={reviewId} />
        </VStack>
      </Box>

      <Box className={styles.inputWrapper} pb={16}>
        <CafeteriaReviewCommentInputSection reviewId={reviewId} />
      </Box>
    </Flex>
  );
};
