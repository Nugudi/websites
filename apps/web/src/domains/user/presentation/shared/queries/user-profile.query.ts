/**
 * User Profile Query
 *
 * TanStack Query v5 pattern - Server + Client shared configuration
 * - Uses `queryOptions` helper for type safety
 * - DI Container injection via factory pattern
 * - Single source of truth for query configuration
 */

import { DOMAIN_QUERY_DEFAULTS } from "@core/infrastructure/configs/tanstack-query/domain-defaults";
import type { getUserClientContainer } from "@/src/domains/user/di/user-client-container";
import type { createUserServerContainer } from "@/src/domains/user/di/user-server-container";
import { UserAdapter } from "../adapters/user.adapter";
import type { UserProfileItem } from "../types/user.type";

/**
 * User Profile Query Key
 *
 * @remarks
 * Hierarchical key structure: ['user', 'profile', 'me']
 * - user: domain
 * - profile: feature
 * - me: specific resource (current user)
 */
export const userProfileQueryKey = ["user", "profile", "me"] as const;

/**
 * User Profile Query Options
 *
 * @remarks
 * - Shared between Server and Client
 * - Uses domain-specific defaults from DOMAIN_QUERY_DEFAULTS.user
 */
export const userProfileQueryOptions = {
  queryKey: userProfileQueryKey,
  ...DOMAIN_QUERY_DEFAULTS.user,
} as const;

/**
 * User Profile queryFn Factory
 *
 * @remarks
 * - DI Container injection pattern
 * - Works with both Server Container and Client Container
 * - Executes UseCase and transforms Entity → UI Type via Adapter
 *
 * @param container - User DI Container (Server or Client)
 * @returns queryFn that fetches and transforms user profile
 *
 * @example
 * // Server Component (prefetch)
 * const queryFn = createUserProfileQueryFn(createUserServerContainer());
 *
 * @example
 * // Client Component (useQuery)
 * const queryFn = createUserProfileQueryFn(getUserClientContainer());
 */
export const createUserProfileQueryFn = (
  container:
    | ReturnType<typeof getUserClientContainer>
    | ReturnType<typeof createUserServerContainer>,
) => {
  return async (): Promise<UserProfileItem> => {
    const getMyProfileUseCase = container.getGetMyProfile();
    const profile = await getMyProfileUseCase.execute();
    return UserAdapter.toUiItem(profile);
  };
};

/**
 * User Profile Complete Query (Server Convenience)
 *
 * @remarks
 * - Convenience function for Server Components
 * - Combines queryOptions + queryFn for prefetchQuery
 *
 * @param container - User Server DI Container
 * @returns Complete query configuration for server-side prefetch
 *
 * @example
 * // Server Component
 * const queryClient = await getQueryClient();
 * await queryClient.prefetchQuery(createUserProfileQuery(createUserServerContainer()));
 */
export const createUserProfileQuery = (
  container: ReturnType<typeof createUserServerContainer>,
) => ({
  ...userProfileQueryOptions,
  queryFn: createUserProfileQueryFn(container),
});
