import { createUserServerContainer } from "@/src/domains/user/di/user-server-container";
import { USER_PROFILE_QUERY_KEY } from "../../constants/query-keys";

export const userProfileQueryServer = {
  queryKey: USER_PROFILE_QUERY_KEY,
  staleTime: 10 * 60 * 1000,
  gcTime: 30 * 60 * 1000,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchOnReconnect: false,
  queryFn: async () => {
    const userContainer = createUserServerContainer();
    const getMyProfileUseCase = userContainer.getGetMyProfile();

    return getMyProfileUseCase.execute();
  },
} as const;
