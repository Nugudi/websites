import { getUserClientContainer } from "@/src/domains/user/di/user-client-container";
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
    const container = getUserClientContainer();
    const getMyProfileUseCase = container.getGetMyProfile();
    return getMyProfileUseCase.execute();
  },
} as const;
