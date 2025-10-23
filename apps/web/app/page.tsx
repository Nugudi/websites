import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { CafeteriaHomeView } from "@/src/domains/cafeteria/home/ui/views/cafeteria-home-view";
import { userProfileQueryServer } from "@/src/domains/user/hooks/queries/user-profile.query.server";
import getQueryClient from "@/src/shared/infrastructure/configs/tanstack-query/get-query-client";

const HomePage = async () => {
  const queryClient = getQueryClient();

  // 프로필 정보 prefetch - userProfileQueryServer가 자동으로 토큰 주입 처리
  // AuthService를 통해 세션과 토큰을 내부적으로 획득
  await queryClient.prefetchQuery(userProfileQueryServer);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CafeteriaHomeView />
    </HydrationBoundary>
  );
};

export default HomePage;
