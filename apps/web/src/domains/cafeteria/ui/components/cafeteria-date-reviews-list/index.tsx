"use client";

import { Body, VStack } from "@nugudi/react-components-layout";
import { ReviewCard } from "@nugudi/react-components-review-card";
import { getMockReviews } from "../../../mocks/cafeteria-mock-data";

interface CafeteriaDateReviewsListProps {
  cafeteriaId: string;
  date: string;
  onCommentClick: (reviewId: string) => void;
}

export const CafeteriaDateReviewsList = ({
  cafeteriaId: _cafeteriaId,
  date: _date,
  onCommentClick,
}: CafeteriaDateReviewsListProps) => {
  const reviews = getMockReviews();

  return (
    <VStack width="100%">
      {reviews.length === 0 ? (
        <Body fontSize="b3" color="zinc">
          아직 작성된 리뷰가 없습니다.
        </Body>
      ) : (
        <VStack gap={16}>
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              date={review.date}
              reviewText={review.content}
              imageUrl={review.imageUrl}
              badges={review.badges}
              onClick={() => onCommentClick(review.id)}
            />
          ))}
        </VStack>
      )}
    </VStack>
  );
};
