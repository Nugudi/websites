import { CafeteriaReviewDetailView } from "@/src/domains/cafeteria/reviews/detail/ui/views/cafeteria-review-detail-view";

interface CafeteriaReviewDetailPageProps {
  params: Promise<{
    reviewId: string;
  }>;
}

// 구내식당 리뷰 상세 페이지
const CafeteriaReviewDetailPage = async ({
  params,
}: CafeteriaReviewDetailPageProps) => {
  const { reviewId } = await params;

  return <CafeteriaReviewDetailView reviewId={reviewId} />;
};

export default CafeteriaReviewDetailPage;
