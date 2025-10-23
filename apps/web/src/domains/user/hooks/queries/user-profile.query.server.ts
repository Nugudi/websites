/**
 * Server-side용 User Profile Query
 *
 * 이 파일은 서버 컴포넌트에서만 import되어야 합니다.
 * 클라이언트 번들에 포함되지 않도록 주의하세요.
 */

import { createAuthServerContainer } from "@/src/di/auth-server-container";
import { USER_PROFILE_QUERY_KEY } from "../../constants/query-keys";

/**
 * Server-side용 User Profile Query Options
 *
 * Page 컴포넌트에서 prefetch할 때 사용합니다.
 * UserService를 통해 비즈니스 로직을 처리하고 자동으로 토큰이 주입됩니다.
 *
 * @returns TanStack Query options with automatic token injection
 *
 * @example
 * ```typescript
 * // app/page.tsx (Server Component)
 * import { userProfileQueryServer } from "@/src/domains/user/hooks/queries/user-profile.query.server";
 * await queryClient.prefetchQuery(userProfileQueryServer);
 * ```
 */
export const userProfileQueryServer = {
  queryKey: USER_PROFILE_QUERY_KEY,
  staleTime: 10 * 60 * 1000, // 10분
  gcTime: 30 * 60 * 1000, // 30분
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchOnReconnect: false,
  queryFn: async () => {
    // UserService를 통해 비즈니스 로직 처리 (자동 토큰 주입)
    const container = createAuthServerContainer();
    const userService = container.getUserService();

    return userService.getMyProfile();
  },
} as const;
