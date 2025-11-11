/**
 * User DTO
 */

import type { paths } from "@nugudi/types";

// API Response Types
export type GetMyProfileResponse =
  paths["/api/v1/users/me"]["get"]["responses"]["200"]["content"]["*/*"];

export type CheckNicknameAvailabilityResponse =
  paths["/api/v1/users/nickname/availability"]["get"]["responses"]["200"]["content"]["*/*"];

// API Parameter Types
export type CheckNicknameAvailabilityParams =
  paths["/api/v1/users/nickname/availability"]["get"]["parameters"]["query"];

// User Data Type from Response
export type UserProfileDTO = GetMyProfileResponse extends { data: infer T }
  ? T
  : never;
