"use client";

import { CafeteriaDateReviewsSection } from "../../sections/cafeteria-date-reviews-section";

interface CafeteriaDateReviewsViewProps {
  cafeteriaId: string;
  date: string;
}

export const CafeteriaDateReviewsView = ({
  cafeteriaId,
  date,
}: CafeteriaDateReviewsViewProps) => {
  return <CafeteriaDateReviewsSection cafeteriaId={cafeteriaId} date={date} />;
};
