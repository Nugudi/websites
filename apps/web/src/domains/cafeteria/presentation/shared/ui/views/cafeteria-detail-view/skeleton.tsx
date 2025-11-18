import { VStack } from "@nugudi/react-components-layout";

export const CafeteriaDetailSkeleton = () => {
  return (
    <VStack width="full" gap={16}>
      {/* Hero Section Skeleton */}
      <div className="h-60 w-full animate-pulse bg-zinc-200" />
      <div className="h-32 w-full animate-pulse rounded-lg bg-zinc-100" />
      {/* Tab Section Skeleton */}
      <div className="h-12 w-full animate-pulse bg-zinc-200" />
      <div className="h-64 w-full animate-pulse rounded-lg bg-zinc-100" />
    </VStack>
  );
};
