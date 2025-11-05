"use server";

import type { SignUpData } from "../../core/types/common";
import { createAuthServerContainer } from "../../di/auth-container";
import type { Session } from "../../domain/entities/session.entity";
import type { User } from "../../domain/entities/user.entity";

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
export async function getClientSession(): Promise<Session | null> {
  const container = createAuthServerContainer();
  const getCurrentSessionUseCase = container.getCurrentSession();

  return await getCurrentSessionUseCase.execute();
}

/**
 * OAuth 인증 URL 조회 (Server Action)
 */
export async function getOAuthAuthorizeUrl(
  _provider: "google",
  redirectUri: string,
): Promise<string> {
  const container = createAuthServerContainer();
  const loginWithOAuthUseCase = container.getLoginWithOAuth();

  // Repository에 직접 접근하여 URL 가져오기
  // TODO: 필요시 별도 UseCase로 분리
  return await loginWithOAuthUseCase.authRepository.getGoogleAuthorizeUrl(
    redirectUri,
  );
}

/**
 * OAuth 로그인 (Server Action)
 */
export async function loginWithOAuth(
  provider: "google",
  code: string,
  redirectUri: string,
): Promise<
  | { type: "EXISTING_USER"; user: User }
  | { type: "NEW_USER"; registrationToken: string }
> {
  const container = createAuthServerContainer();
  const loginWithOAuthUseCase = container.getLoginWithOAuth();

  return await loginWithOAuthUseCase.execute({
    provider,
    code,
    redirectUri,
  });
}

/**
 * 소셜 회원가입 (Server Action)
 */
export async function signUpWithSocial(
  registrationToken: string,
  data: SignUpData,
): Promise<User> {
  const container = createAuthServerContainer();
  const signUpWithSocialUseCase = container.getSignUpWithSocial();

  return await signUpWithSocialUseCase.execute({
    registrationToken,
    userData: data,
  });
}

/**
 * 로그아웃 (Server Action)
 */
export async function logout(): Promise<void> {
  const container = createAuthServerContainer();
  const logoutUseCase = container.getLogout();

  return await logoutUseCase.execute();
}

/**
 * 토큰 갱신 (Server Action)
 * @returns 갱신 성공 여부
 */
export async function refreshToken(): Promise<boolean> {
  const container = createAuthServerContainer();
  const refreshTokenUseCase = container.getRefreshToken();

  return await refreshTokenUseCase.execute();
}
