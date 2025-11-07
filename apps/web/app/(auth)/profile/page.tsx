import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { userProfileQueryServer } from "@/src/domains/user/presentation/hooks/queries/user-profile.query.server";
import { UserProfileView } from "@/src/domains/user/presentation/ui/views/user-profile-view";
import getQueryClient from "@/src/shared/infrastructure/configs/tanstack-query/get-query-client";

export const dynamic = "force-dynamic";

const ProfilePage = async () => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(userProfileQueryServer);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserProfileView />
    </HydrationBoundary>
  );
};

export default ProfilePage;
