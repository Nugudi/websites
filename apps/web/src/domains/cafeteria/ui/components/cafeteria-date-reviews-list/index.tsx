"use client";

import { Body, VStack } from "@nugudi/react-components-layout";
import { ReviewCard } from "@nugudi/react-components-review-card";

interface CafeteriaDateReviewsListProps {
  cafeteriaId: string;
  date: string;
  onCommentClick: (reviewId: string) => void;
}

// Mock data - Replace with API call
const MOCK_REVIEWS = [
  {
    id: "1",
    userId: "user1",
    userName: "김철수",
    rating: 4.5,
    content: "오늘 점심 정말 맛있었어요! 김치찌개가 진짜 최고였습니다.",
    imageUrl: undefined,
    date: "2025-10-18",
    badges: [
      { emoji: "⭐", label: "맛있어요" },
      { emoji: "👍", label: "추천해요" },
    ],
    commentCount: 5,
  },
  {
    id: "2",
    userId: "user2",
    userName: "이영희",
    rating: 3.5,
    content: "보통이었어요. 양은 충분했는데 맛이 조금 아쉬웠습니다.",
    imageUrl: undefined,
    date: "2025-10-18",
    badges: [{ emoji: "😐", label: "보통이에요" }],
    commentCount: 2,
  },
  {
    id: "3",
    userId: "user3",
    userName: "박민수",
    rating: 5,
    content: "완벽한 한 끼였습니다! 가격 대비 최고예요.",
    imageUrl: undefined,
    date: "2025-10-18",
    badges: [
      { emoji: "⭐", label: "맛있어요" },
      { emoji: "💰", label: "가성비" },
    ],
    commentCount: 8,
  },
];

export const CafeteriaDateReviewsList = ({
  cafeteriaId,
  date,
  onCommentClick,
}: CafeteriaDateReviewsListProps) => {
  // TODO: Replace with actual API call using cafeteriaId and date
  const reviews = MOCK_REVIEWS;

  return (
    <VStack width="100%">
      {reviews.length === 0 ? (
        <Body fontSize="b3" color="zinc" style={{ padding: "0 16px" }}>
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
              style={{ width: "100%" }}
            />
          ))}
        </VStack>
      )}
    </VStack>
  );
};
