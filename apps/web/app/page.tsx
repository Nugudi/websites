import getQueryClient from "@core/infrastructure/configs/tanstack-query/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { CafeteriaHomeView } from "@/src/domains/cafeteria/presentation/shared/ui/views/cafeteria-home-view";
import { createUserServerContainer } from "@/src/domains/user/di/user-server-container";
import { createUserProfileQuery } from "@/src/domains/user/presentation/shared/queries";

export const dynamic = "force-dynamic";

const HomePage = async () => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(
    createUserProfileQuery(createUserServerContainer()),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CafeteriaHomeView />
    </HydrationBoundary>
  );
};

export default HomePage;
