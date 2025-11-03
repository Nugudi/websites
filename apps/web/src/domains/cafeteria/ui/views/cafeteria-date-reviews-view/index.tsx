"use client";

import { VStack } from "@nugudi/react-components-layout";
import { NavBar } from "@/src/shared/interface-adapters/components/nav-bar";
import { CafeteriaDateReviewsSection } from "../../sections/cafeteria-date-reviews-section";

interface CafeteriaDateReviewsViewProps {
  cafeteriaId: string;
  date: string;
}

export const CafeteriaDateReviewsView = ({
  cafeteriaId,
  date,
}: CafeteriaDateReviewsViewProps) => {
  return (
    <VStack gap={16} w="full">
      <NavBar />
      <CafeteriaDateReviewsSection cafeteriaId={cafeteriaId} date={date} />
    </VStack>
  );
};
