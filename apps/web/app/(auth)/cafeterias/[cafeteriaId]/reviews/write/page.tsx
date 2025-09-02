import type { Metadata } from "next";
import { ReviewWriteView } from "@/src/domains/cafeteria/reviews/write/ui/views/review-write-view";

interface PageProps {
  params: {
    cafeteriaId: string;
  };
}

export const metadata: Metadata = {
  title: "리뷰 작성 | 너구디",
  description: "구내식당 메뉴에 대한 리뷰를 작성해주세요",
};

const ReviewWritePage = async ({ params }: PageProps) => {
  const { cafeteriaId } = await params;

  // TODO: Fetch cafeteria info from API
  return (
    <ReviewWriteView cafeteriaId={cafeteriaId} cafeteriaName="더용민푸드" />
  );
};

export default ReviewWritePage;
