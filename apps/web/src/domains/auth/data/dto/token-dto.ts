/**
 * Token DTOs
 *
 * OpenAPI 타입을 그대로 사용합니다.
 */

import type { paths } from "@nugudi/types";

/**
 * Token Refresh 요청 DTO
 * If OpenAPI doesn't define requestBody, fallback to manual definition
 */
export type RefreshTokenRequestDTO =
  paths["/api/v1/auth/refresh"]["post"] extends {
    requestBody: { content: { "application/json": infer T } };
  }
    ? T
    : {
        refreshToken: string;
        deviceInfo: {
          deviceType: "IOS" | "ANDROID" | "WEB";
          deviceUniqueId: string;
        };
      };

/**
 * Token Refresh 응답 DTO (전체 응답)
 */
export type RefreshTokenResponseDTO =
  paths["/api/v1/auth/refresh"]["post"]["responses"]["200"]["content"]["*/*"];

/**
 * Token Data (응답의 data 필드)
 */
export type TokenDataDTO = NonNullable<RefreshTokenResponseDTO["data"]>;
