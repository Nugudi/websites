import { createAuthServerContainer } from "@/src/di/auth-server-container";
import { USER_PROFILE_QUERY_KEY } from "../../constants/query-keys";

export const userProfileQueryServer = {
  queryKey: USER_PROFILE_QUERY_KEY,
  staleTime: 10 * 60 * 1000,
  gcTime: 30 * 60 * 1000,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchOnReconnect: false,
  queryFn: async () => {
    const container = createAuthServerContainer();
    const userService = container.getUserService();

    return userService.getMyProfile();
  },
} as const;
