import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { auth } from "@/src/domains/auth/auth-server";
import { CafeteriaHomeView } from "@/src/domains/cafeteria/home/ui/views/cafeteria-home-view";
import { userProfileQueryServer } from "@/src/domains/user/hooks/queries/user-profile.query";
import getQueryClient from "@/src/shared/configs/tanstack-query/get-query-client";

const HomePage = async () => {
  const queryClient = getQueryClient();
  // Middleware에서 이미 토큰 갱신을 처리하므로 refresh: false 사용
  const session = await auth.getSession({ refresh: false });

  // 프로필 정보 prefetch - userProfileQueryServer가 토큰 주입과 캐싱 옵션을 처리
  // Middleware가 인증을 보장하므로 session과 accessToken은 항상 존재
  await queryClient.prefetchQuery(
    // biome-ignore lint/style/noNonNullAssertion: Middleware ensures session is always present
    userProfileQueryServer(session!.tokenSet.accessToken),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CafeteriaHomeView />
    </HydrationBoundary>
  );
};

export default HomePage;
