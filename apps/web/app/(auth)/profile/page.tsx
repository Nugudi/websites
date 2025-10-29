import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { userProfileQueryServer } from "@/src/domains/user/hooks/queries/user-profile.query.server";
import { UserProfileView } from "@/src/domains/user/ui/views/user-profile-view";
import getQueryClient from "@/src/shared/infrastructure/configs/tanstack-query/get-query-client";

// 인증이 필요한 페이지이므로 빌드 시점 프리렌더링 비활성화
export const dynamic = "force-dynamic";

const ProfilePage = async () => {
  const queryClient = getQueryClient();

  // 프로필 정보 prefetch - userProfileQueryServer가 자동으로 토큰 주입 처리
  await queryClient.prefetchQuery(userProfileQueryServer);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserProfileView />
    </HydrationBoundary>
  );
};

export default ProfilePage;
