"use server";

import { createAuthServerContainer } from "@/src/di/auth-server-container";
import type { SignUpRequest, SignUpResult } from "../services/auth-service";

/**
 * 클라이언트용 세션 조회 (Server Action)
 *
 * Client Component에서 세션 정보를 가져올 때 사용합니다.
 *
 * @returns Session | null
 *
 * @example
 * ```tsx
 * "use client";
 *
 * const session = await getClientSession();
 * console.log(session?.accessToken);
 * ```
 */
export async function getClientSession() {
  const container = createAuthServerContainer();
  const authService = container.getAuthService();

  return await authService.getCurrentSession();
}

/**
 * OAuth 인증 URL 조회 (Server Action)
 */
export async function getOAuthAuthorizeUrl(
  provider: "google" | "kakao" | "naver",
  redirectUri: string,
): Promise<string> {
  const container = createAuthServerContainer();
  const authService = container.getAuthService();

  return await authService.getOAuthAuthorizeUrl(provider, redirectUri);
}

/**
 * OAuth 로그인 (Server Action)
 */
export async function loginWithOAuth(
  provider: "google" | "kakao" | "naver",
  code: string,
  redirectUri: string,
) {
  const container = createAuthServerContainer();
  const authService = container.getAuthService();

  return await authService.loginWithOAuth(provider, code, redirectUri);
}

/**
 * 소셜 회원가입 (Server Action)
 */
export async function signUpWithSocial(
  registrationToken: string,
  data: SignUpRequest,
): Promise<SignUpResult> {
  const container = createAuthServerContainer();
  const authService = container.getAuthService();

  return await authService.signUpWithSocial(registrationToken, data);
}

/**
 * 로그아웃 (Server Action)
 */
export async function logout(): Promise<void> {
  const container = createAuthServerContainer();
  const authService = container.getAuthService();

  return await authService.logout();
}

/**
 * 토큰 갱신 (Server Action)
 */
export async function refreshToken(): Promise<boolean> {
  const container = createAuthServerContainer();
  const authService = container.getAuthService();

  return await authService.refreshToken();
}

/**
 * Server-Side에서 Device ID를 가져옵니다.
 *
 * @returns deviceId - 기존에 저장된 Device ID 또는 새로 생성된 UUID
 *
 * @example
 * ```tsx
 * const deviceId = await getDeviceId();
 * ```
 */
export async function getDeviceId(): Promise<string> {
  const container = createAuthServerContainer();
  const authService = container.getAuthService();

  return await authService.sessionManager.getDeviceId();
}
