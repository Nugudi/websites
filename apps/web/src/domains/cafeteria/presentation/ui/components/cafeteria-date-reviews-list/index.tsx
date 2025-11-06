"use client";

import { CommentIcon } from "@nugudi/assets-icons";
import { Body, VStack } from "@nugudi/react-components-layout";
import { ReviewCard } from "@nugudi/react-components-review-card";
import type { ReviewMockData } from "../../../../data/utils/cafeteria-mock-data";
import * as styles from "./index.css";

interface CafeteriaDateReviewsListProps {
  cafeteriaId: string;
  date: string;
  reviews: ReviewMockData[];
  onCommentClick: (reviewId: string) => void;
}

export const CafeteriaDateReviewsList = ({
  cafeteriaId: _cafeteriaId,
  date: _date,
  reviews,
  onCommentClick,
}: CafeteriaDateReviewsListProps) => {
  return (
    <VStack width="100%">
      {reviews.length === 0 ? (
        <Body fontSize="b3" color="zinc">
          아직 작성된 리뷰가 없습니다.
        </Body>
      ) : (
        <VStack gap={24}>
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              username={review.userName}
              userLevel={review.userLevel}
              date={review.date}
              reviewText={review.content}
              imageUrl={review.imageUrl}
              badges={review.badges}
              rightIcon={
                <CommentIcon
                  width={20}
                  height={20}
                  className={styles.commentIcon}
                  onClick={() => onCommentClick(review.id)}
                  role="button"
                  tabIndex={0}
                />
              }
            />
          ))}
        </VStack>
      )}
    </VStack>
  );
};
