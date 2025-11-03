"use client";

import { VStack } from "@nugudi/react-components-layout";
import { useState } from "react";
import { NavBar } from "@/src/shared/interface-adapters/components/nav-bar";
import { CafeteriaReviewCommentBottomSheet } from "../../components/cafeteria-review-comment-bottom-sheet";
import { CafeteriaDateReviewsSection } from "../../sections/cafeteria-date-reviews-section";

interface CafeteriaDateReviewsViewProps {
  cafeteriaId: string;
  date: string;
}

export const CafeteriaDateReviewsView = ({
  cafeteriaId,
  date,
}: CafeteriaDateReviewsViewProps) => {
  const [showCommentSheet, setShowCommentSheet] = useState(false);

  const handleCommentClick = (_reviewId: string) => {
    setShowCommentSheet(true);
  };

  const handleCloseCommentSheet = () => {
    setShowCommentSheet(false);
  };

  return (
    <>
      <VStack gap={16} w="full">
        <NavBar />
        <CafeteriaDateReviewsSection
          cafeteriaId={cafeteriaId}
          date={date}
          onCommentClick={handleCommentClick}
        />
      </VStack>

      <CafeteriaReviewCommentBottomSheet
        isOpen={showCommentSheet}
        onClose={handleCloseCommentSheet}
      />
    </>
  );
};
