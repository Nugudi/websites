import { ReviewCard } from "@nugudi/react-components-review-card";
import { MOCK_CAFETERIA_REVIEW } from "../../../constants/mock-review";

export const CafeteriaReviewDetailSection = () => {
  return (
    <ReviewCard
      imageUrl={MOCK_CAFETERIA_REVIEW.imageUrl}
      date={MOCK_CAFETERIA_REVIEW.date}
      reviewText={MOCK_CAFETERIA_REVIEW.reviewText}
      badges={MOCK_CAFETERIA_REVIEW.badges}
    />
  );
};
