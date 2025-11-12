/**
 * Token Refresh Request DTO
 *
 * OpenAPI 타입을 그대로 사용합니다.
 */

import type { paths } from "@nugudi/types";

/**
 * Token Refresh 요청 DTO
 * If OpenAPI doesn't define requestBody, fallback to manual definition
 *
 * NOTE: API는 requestBody가 아닌 헤더를 사용합니다:
 * - Authorization: Bearer {refreshToken}
 * - X-Device-ID: {deviceId}
 */
export type RefreshTokenRequestDTO =
  paths["/api/v1/auth/refresh"]["post"] extends {
    requestBody: { content: { "application/json": infer T } };
  }
    ? T
    : {
        refreshToken: string;
        deviceId: string;
      };
