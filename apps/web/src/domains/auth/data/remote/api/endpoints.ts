/**
 * Auth API Endpoints
 *
 * Data Layer의 Infrastructure 설정
 * - API 엔드포인트 경로 정의
 * - Domain Layer와 분리 (Clean Architecture)
 */

export const AUTH_API_ENDPOINTS = {
  // Google OAuth
  GOOGLE_AUTHORIZE: "/api/v1/auth/login/google/authorize-url",
  GOOGLE_LOGIN: "/api/v1/auth/login/google",

  // Kakao OAuth
  KAKAO_AUTHORIZE: "/api/v1/auth/login/kakao/authorize-url",
  KAKAO_LOGIN: "/api/v1/auth/login/kakao",

  // Naver OAuth
  NAVER_AUTHORIZE: "/api/v1/auth/login/naver/authorize-url",
  NAVER_LOGIN: "/api/v1/auth/login/naver",

  // Token Management
  REFRESH_TOKEN: "/api/v1/auth/refresh",

  // Session Management
  LOGOUT: "/api/v1/auth/logout",

  // Sign Up
  SIGNUP_SOCIAL: "/api/v1/auth/signup/social",
} as const;
