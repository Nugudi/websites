import { CafeteriaReviewDetailView } from "@/src/domains/cafeteria/reviews/detail/ui/views/cafeteria-review-detail-view";

interface CafeteriaReviewDetailPageProps {
  params: Promise<{
    cafeteriaId: string;
    reviewId: string;
  }>;
}

// 구내식당 리뷰 상세 페이지
const CafeteriaReviewDetailPage = async ({
  params,
}: CafeteriaReviewDetailPageProps) => {
  const { cafeteriaId, reviewId } = await params;

  return (
    <CafeteriaReviewDetailView cafeteriaId={cafeteriaId} reviewId={reviewId} />
  );
};

export default CafeteriaReviewDetailPage;
