/**
 * Google Authorize URL Response DTO
 *
 * OpenAPI 타입을 그대로 사용합니다.
 */

import type { paths } from "@nugudi/types";

/**
 * Google Authorize URL 응답 DTO
 */
export type GoogleAuthorizeUrlResponseDTO =
  paths["/api/v1/auth/login/google/authorize-url"]["get"]["responses"]["200"]["content"]["*/*"];
