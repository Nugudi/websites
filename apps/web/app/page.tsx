import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { CafeteriaHomeView } from "@/src/domains/cafeteria/ui/views/cafeteria-home-view";
import { userProfileQueryServer } from "@/src/domains/user/presentation/hooks/queries/user-profile.query.server";
import getQueryClient from "@/src/shared/infrastructure/configs/tanstack-query/get-query-client";

// 인증이 필요한 페이지이므로 빌드 시점 프리렌더링 비활성화
export const dynamic = "force-dynamic";

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
