"use client";

import { ReviewCard } from "@nugudi/react-components-review-card";

interface CafeteriaReviewDetailSectionProps {
  cafeteriaId: string;
  reviewId: string;
}

export const CafeteriaReviewDetailSection = ({
  cafeteriaId,
  reviewId,
}: CafeteriaReviewDetailSectionProps) => {
  // Mock data
  const review = {
    id: reviewId,
    cafeteriaId,
    imageUrl: "/mocks/test-meal.png",
    date: "2025.7.7.화",
    reviewText:
      "고기가 아주 맛있고, 미트볼 듬뿍이었어요 그런데 .. 좀마타 미트볼이 없는 줄이 있을 수 있습니다. 랜덤핑",
    badges: [
      { emoji: "😊", label: "맛있어요" },
      { emoji: "😋", label: "달달혀요" },
    ],
  };

  return (
    <ReviewCard
      imageUrl={review.imageUrl}
      date={review.date}
      reviewText={review.reviewText}
      badges={review.badges}
    />
  );
};
