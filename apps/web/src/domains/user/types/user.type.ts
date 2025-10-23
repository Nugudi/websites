/**
 * User Domain Types
 *
 * 사용자 도메인의 타입 정의
 */

import type { paths } from "@nugudi/types";

/**
 * API Response Type Helpers
 */
export type GetMyProfileResponse =
  paths["/api/v1/users/me"]["get"]["responses"]["200"]["content"]["*/*"];

export type CheckNicknameAvailabilityResponse =
  paths["/api/v1/users/nickname/availability"]["get"]["responses"]["200"]["content"]["*/*"];

export type CheckNicknameAvailabilityParams =
  paths["/api/v1/users/nickname/availability"]["get"]["parameters"]["query"];

/**
 * User Profile Data Type (실제 프로필 데이터)
 *
 * OpenAPI 응답 구조:
 * {
 *   success: boolean;
 *   data: UserProfileData  <-- 이 부분
 * }
 */
export type UserProfileData = NonNullable<
  NonNullable<GetMyProfileResponse>["data"]
>;

/**
 * Nickname Availability Data Type (실제 중복 확인 데이터)
 *
 * OpenAPI 응답 구조:
 * {
 *   success: boolean;
 *   data: CheckNicknameAvailabilityData  <-- 이 부분
 * }
 */
export type CheckNicknameAvailabilityData = NonNullable<
  NonNullable<CheckNicknameAvailabilityResponse>["data"]
>;
