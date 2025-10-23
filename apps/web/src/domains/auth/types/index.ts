import type { components, paths } from "@nugudi/types";
import type { cookies } from "next/headers";

/**
 * Request Types (from components.schemas)
 */
export type SignUpSocialRequest = components["schemas"]["SignUpSocialRequest"];
export type SignUpLocalRequest = components["schemas"]["SignUpLocalRequest"];
export type UserDeviceInfoDTO = components["schemas"]["UserDeviceInfoDTO"];

/**
 * Response Types (from paths)
 */

// OAuth Login Responses
export type GoogleLoginResponse =
  paths["/api/v1/auth/login/google"]["post"]["responses"]["200"]["content"]["*/*"];
export type KakaoLoginResponse =
  paths["/api/v1/auth/login/kakao"]["post"]["responses"]["200"]["content"]["*/*"];
export type NaverLoginResponse =
  paths["/api/v1/auth/login/naver"]["post"]["responses"]["200"]["content"]["*/*"];

// SignUp Responses
export type SignUpSocialResponse =
  paths["/api/v1/auth/signup/social"]["post"]["responses"]["201"]["content"]["*/*"];
export type SignUpLocalResponse =
  paths["/api/v1/auth/signup/local"]["post"]["responses"]["201"]["content"]["*/*"];

// Token & Auth Responses
export type RefreshTokenResponse =
  paths["/api/v1/auth/refresh"]["post"]["responses"]["200"]["content"]["*/*"];
export type LogoutResponse =
  paths["/api/v1/auth/logout"]["post"]["responses"]["200"]["content"]["*/*"];

// OAuth Authorize URL Responses
export type GoogleAuthorizeUrlResponse =
  paths["/api/v1/auth/login/google/authorize-url"]["get"]["responses"]["200"]["content"]["*/*"];
export type KakaoAuthorizeUrlResponse =
  paths["/api/v1/auth/login/kakao/authorize-url"]["get"]["responses"]["200"]["content"]["*/*"];
export type NaverAuthorizeUrlResponse =
  paths["/api/v1/auth/login/naver/authorize-url"]["get"]["responses"]["200"]["content"]["*/*"];

/**
 * Cookie Options
 */
export interface CookieOptions
  extends NonNullable<
    Parameters<Awaited<ReturnType<typeof cookies>>["set"]>[2]
  > {}

/**
 * Re-export domain-specific types
 */
export * from "./social-sign-up";
export * from "./terms";
