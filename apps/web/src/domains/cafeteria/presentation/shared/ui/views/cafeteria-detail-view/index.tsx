import { NavBar } from "@core/ui/components/nav-bar";
import { VStack } from "@nugudi/react-components-layout";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { CafeteriaHeroSection } from "../../sections/cafeteria-hero-section";
import { CafeteriaTabSection } from "../../sections/cafeteria-tab-section";

interface CafeteriaDetailViewProps {
  cafeteriaId: string;
}

export const CafeteriaDetailView = ({
  cafeteriaId,
}: CafeteriaDetailViewProps) => {
  return (
    <VStack w="full">
      <NavBar />
      <VStack gap={16} w="full">
        <ErrorBoundary fallback={<CafeteriaHeroSectionError />}>
          <Suspense fallback={<CafeteriaHeroSectionSkeleton />}>
            <CafeteriaHeroSection cafeteriaId={cafeteriaId} />
          </Suspense>
        </ErrorBoundary>
        <CafeteriaTabSection cafeteriaId={cafeteriaId} />
      </VStack>
    </VStack>
  );
};

const CafeteriaHeroSectionSkeleton = () => {
  return (
    <VStack width="full">
      <div className="h-60 w-full animate-pulse bg-zinc-200" />
      <div className="h-32 w-full animate-pulse rounded-lg bg-zinc-100" />
    </VStack>
  );
};

const CafeteriaHeroSectionError = () => {
  return (
    <VStack width="full">
      <div className="flex h-60 w-full items-center justify-center bg-zinc-100">
        <p className="text-zinc-500">식당 정보를 불러올 수 없습니다.</p>
      </div>
    </VStack>
  );
};
