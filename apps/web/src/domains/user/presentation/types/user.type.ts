import type { paths } from "@nugudi/types";

export type GetMyProfileResponse =
  paths["/api/v1/users/me"]["get"]["responses"]["200"]["content"]["*/*"];

export type CheckNicknameAvailabilityResponse =
  paths["/api/v1/users/nickname/availability"]["get"]["responses"]["200"]["content"]["*/*"];

export type CheckNicknameAvailabilityParams =
  paths["/api/v1/users/nickname/availability"]["get"]["parameters"]["query"];

export type UserProfileData = NonNullable<
  NonNullable<GetMyProfileResponse>["data"]
>;

export type CheckNicknameAvailabilityData = NonNullable<
  NonNullable<CheckNicknameAvailabilityResponse>["data"]
>;
