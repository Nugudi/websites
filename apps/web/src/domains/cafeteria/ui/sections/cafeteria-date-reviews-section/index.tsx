"use client";

import { VStack } from "@nugudi/react-components-layout";
import { CafeteriaDateReviewsList } from "../../components/cafeteria-date-reviews-list";
import * as styles from "./index.css";

interface CafeteriaDateReviewsSectionProps {
  cafeteriaId: string;
  date: string;
  onCommentClick: (reviewId: string) => void;
}

export const CafeteriaDateReviewsSection = ({
  cafeteriaId,
  date,
  onCommentClick,
}: CafeteriaDateReviewsSectionProps) => {
  return (
    <VStack gap={16} w={"100%"} pX={16} className={styles.reviewsWrapper}>
      <CafeteriaDateReviewsList
        cafeteriaId={cafeteriaId}
        date={date}
        onCommentClick={onCommentClick}
      />
    </VStack>
  );
};
