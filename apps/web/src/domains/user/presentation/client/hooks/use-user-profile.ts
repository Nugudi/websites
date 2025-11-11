"use client";

/**
 * User Profile Query Hook
 *
 * Client-side hook that wraps TanStack Query's useSuspenseQuery
 * with proper type inference for User Profile
 */

import { useSuspenseQuery } from "@tanstack/react-query";
import { getUserClientContainer } from "@/src/domains/user/di/user-client-container";
import {
  createUserProfileQueryFn,
  userProfileQueryOptions,
} from "../../shared/queries";
import type { UserProfileItem } from "../../shared/types/user.type";

/**
 * User Profile Query Hook
 *
 * @returns Suspense-enabled query result with User Profile data
 *
 * @example
 * const { data: profileData } = useUserProfile();
 */
export const useUserProfile = () => {
  return useSuspenseQuery<UserProfileItem>({
    ...userProfileQueryOptions,
    queryFn: createUserProfileQueryFn(getUserClientContainer()),
  });
};
