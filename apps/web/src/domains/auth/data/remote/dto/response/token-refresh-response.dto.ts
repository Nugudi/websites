/**
 * Token Refresh Response DTO
 *
 * OpenAPI 타입을 그대로 사용합니다.
 */

import type { paths } from "@nugudi/types";

/**
 * Token Refresh 응답 DTO (전체 응답)
 */
export type RefreshTokenResponseDTO =
  paths["/api/v1/auth/refresh"]["post"]["responses"]["200"]["content"]["*/*"];

/**
 * Token Data (응답의 data 필드)
 */
export type TokenDataDTO = NonNullable<RefreshTokenResponseDTO["data"]>;
