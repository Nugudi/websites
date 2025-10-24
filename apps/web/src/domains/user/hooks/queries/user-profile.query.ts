import { authClientContainer } from "@/src/di/auth-client-container";
import { USER_PROFILE_QUERY_KEY } from "../../constants/query-keys";

/**
 * User Profile Query Options
 *
 * 프로필 정보는 자주 변경되지 않는 데이터이므로 공격적인 캐싱 전략 적용:
 * - staleTime: 10분 - 이 시간 동안 데이터를 fresh한 상태로 유지 (재조회 안 함)
 * - gcTime: 30분 - 메모리에서 캐시를 유지하는 시간
 * - refetchOnWindowFocus: false - 탭 전환 시 재조회 하지 않음
 * - refetchOnMount: false - 컴포넌트 마운트 시 fresh 데이터면 재조회 안 함
 * - refetchOnReconnect: false - 네트워크 재연결 시 재조회 안 함
 */
const USER_PROFILE_QUERY_OPTIONS = {
  staleTime: 10 * 60 * 1000, // 10분
  gcTime: 30 * 60 * 1000, // 30분
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchOnReconnect: false,
} as const;

/**
 * Base User Profile Query Options (공통 부분)
 */
const baseUserProfileQuery = {
  queryKey: USER_PROFILE_QUERY_KEY,
  ...USER_PROFILE_QUERY_OPTIONS,
} as const;

/**
 * Client-side용 User Profile Query Options
 *
 * Client Component에서 useSuspenseQuery와 함께 사용합니다.
 * UserService를 통해 비즈니스 로직을 처리하고 자동으로 토큰이 주입됩니다.
 *
 * @example
 * ```typescript
 * // Section Component (Client Component)
 * const { data } = useSuspenseQuery(userProfileQueryClient);
 * // data는 실제 프로필 데이터: { profile, account, health }
 * ```
 */
export const userProfileQueryClient = {
  ...baseUserProfileQuery,
  queryFn: () => {
    // UserService를 통해 비즈니스 로직 처리 (자동 토큰 주입)
    const userService = authClientContainer.getUserService();
    return userService.getMyProfile();
  },
} as const;
