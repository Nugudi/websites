import { NavBar } from "@core/ui/components/nav-bar";
import { VStack } from "@nugudi/react-components-layout";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { CafeteriaHeroSection } from "../../sections/cafeteria-hero-section";
import { CafeteriaTabSection } from "../../sections/cafeteria-tab-section";
import { CafeteriaDetailError } from "./error";
import { CafeteriaDetailSkeleton } from "./skeleton";

interface CafeteriaDetailViewProps {
  cafeteriaId: string;
}

export const CafeteriaDetailView = ({
  cafeteriaId,
}: CafeteriaDetailViewProps) => {
  return (
    <VStack w="full">
      <NavBar />
      <ErrorBoundary fallback={<CafeteriaDetailError />}>
        <Suspense fallback={<CafeteriaDetailSkeleton />}>
          <VStack gap={16} w="full">
            <CafeteriaHeroSection cafeteriaId={cafeteriaId} />
            <CafeteriaTabSection cafeteriaId={cafeteriaId} />
          </VStack>
        </Suspense>
      </ErrorBoundary>
    </VStack>
  );
};
