/**
 * Google Login Request DTO
 *
 * OpenAPI 타입을 그대로 사용합니다.
 */

import type { paths } from "@nugudi/types";

/**
 * Google Login 요청 DTO
 */
export type GoogleLoginRequestDTO =
  paths["/api/v1/auth/login/google"]["post"]["requestBody"]["content"]["application/json"];
