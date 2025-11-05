import { authClientContainer } from "@/src/di/auth-client-container";
import { USER_PROFILE_QUERY_KEY } from "../../constants/query-keys";

const USER_PROFILE_QUERY_OPTIONS = {
  staleTime: 10 * 60 * 1000,
  gcTime: 30 * 60 * 1000,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchOnReconnect: false,
} as const;

const baseUserProfileQuery = {
  queryKey: USER_PROFILE_QUERY_KEY,
  ...USER_PROFILE_QUERY_OPTIONS,
} as const;

export const userProfileQueryClient = {
  ...baseUserProfileQuery,
  queryFn: () => {
    const userService = authClientContainer.getUserService();
    return userService.getMyProfile();
  },
} as const;
