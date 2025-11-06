import { CafeteriaDateReviewsView } from "@/src/domains/cafeteria/presentation/ui/views/cafeteria-date-reviews-view";

interface PageProps {
  params: Promise<{
    cafeteriaId: string;
    date: string;
  }>;
}

const CafeteriaDateReviewsPage = async ({ params }: PageProps) => {
  const { cafeteriaId, date } = await params;

  return <CafeteriaDateReviewsView cafeteriaId={cafeteriaId} date={date} />;
};

export default CafeteriaDateReviewsPage;
