/**
 * Google Login Response DTOs
 *
 * OpenAPI 타입을 그대로 사용합니다.
 */

import type { paths } from "@nugudi/types";

/**
 * Google Login 응답 DTO
 */
export type GoogleLoginResponseDTO =
  paths["/api/v1/auth/login/google"]["post"]["responses"]["200"]["content"]["*/*"];

/**
 * Existing User Login DTO
 */
export interface ExistingUserLoginDTO {
  type: "EXISTING_USER";
  userId: string;
  email: string;
  name: string;
  profileImageUrl?: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * New User Login DTO
 */
export interface NewUserLoginDTO {
  type: "NEW_USER";
  registrationToken: string;
}

/**
 * Login Result DTO (Union type)
 */
export type LoginResultDTO = ExistingUserLoginDTO | NewUserLoginDTO;
