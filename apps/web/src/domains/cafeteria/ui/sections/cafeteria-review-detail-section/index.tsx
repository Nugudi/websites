import { ReviewCard } from "@nugudi/react-components-review-card";
import { MOCK_CAFETERIA_REVIEW } from "../../../mocks/review-mock-data";

export const CafeteriaReviewDetailSection = () => {
  return (
    <ReviewCard
      username={MOCK_CAFETERIA_REVIEW.username}
      userLevel={MOCK_CAFETERIA_REVIEW.userLevel}
      imageUrl={MOCK_CAFETERIA_REVIEW.imageUrl}
      date={MOCK_CAFETERIA_REVIEW.date}
      reviewText={MOCK_CAFETERIA_REVIEW.reviewText}
      badges={MOCK_CAFETERIA_REVIEW.badges}
    />
  );
};
