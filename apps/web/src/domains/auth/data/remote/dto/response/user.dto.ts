/**
 * User DTO
 *
 * OpenAPI 타입을 그대로 사용합니다.
 * SignUpDataDTO가 사용자 정보를 포함하므로 이를 재사용합니다.
 */

import type { paths } from "@nugudi/types";
import type { SignUpDataDTO } from "./sign-up-response.dto";

/**
 * User DTO (API 응답 형식)
 * SignUpDataDTO와 동일한 구조
 */
export type UserDTO = NonNullable<SignUpDataDTO>;

/**
 * Nickname Availability DTOs
 */
export type CheckNicknameAvailabilityResponse =
  paths["/api/v1/users/nickname/availability"]["get"]["responses"]["200"]["content"]["*/*"];

export type CheckNicknameAvailabilityParams =
  paths["/api/v1/users/nickname/availability"]["get"]["parameters"]["query"];
