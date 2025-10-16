import { getMyProfile } from "@nugudi/api";
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
 * Server-side용 User Profile Query Factory
 *
 * Page 컴포넌트에서 prefetch할 때 사용합니다.
 * Access Token을 명시적으로 주입하여 서버에서 안전하게 API를 호출합니다.
 *
 * @param accessToken - 사용자 인증 토큰
 * @returns TanStack Query options with token-injected queryFn
 *
 * @example
 * ```typescript
 * // app/page.tsx (Server Component)
 * const session = await auth.getSession({ refresh: false });
 * await queryClient.prefetchQuery(
 *   userProfileQueryServer(session.tokenSet.accessToken)
 * );
 * ```
 */
export const userProfileQueryServer = (accessToken: string) => ({
  ...baseUserProfileQuery,
  queryFn: () =>
    getMyProfile({
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
});

/**
 * Client-side용 User Profile Query Options
 *
 * Client Component에서 useSuspenseQuery와 함께 사용합니다.
 * HTTP 클라이언트가 자동으로 토큰을 헤더에 추가합니다.
 *
 * @example
 * ```typescript
 * // Section Component (Client Component)
 * const { data } = useSuspenseQuery(userProfileQueryClient);
 * ```
 */
export const userProfileQueryClient = {
  ...baseUserProfileQuery,
  queryFn: () => getMyProfile(),
} as const;
