/**
 * Sign Up Response DTO
 *
 * OpenAPI 타입을 그대로 사용합니다.
 */

import type { paths } from "@nugudi/types";

/**
 * Social Sign Up 응답 DTO
 */
export type SignUpDataDTO = NonNullable<
  paths["/api/v1/auth/signup/social"]["post"]["responses"]["201"]["content"]["*/*"]["data"]
>;
