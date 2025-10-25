/**
 * Auth Service
 *
 * 인증 비즈니스 로직을 담당하는 Service Layer
 * Repository와 Session Manager를 조합하여 복잡한 인증 플로우를 처리합니다.
 */

import type { SessionManager } from "@/src/shared/infrastructure/storage/session-manager";
import type { AuthRepository } from "../repositories/auth-repository";

/**
 * OAuth Provider 타입
 */
export type OAuthProvider = "google" | "kakao" | "naver";

/**
 * 로그인 결과 타입
 */
export type LoginResult =
  | {
      type: "EXISTING_USER";
      userId: number;
      nickname: string;
    }
  | {
      type: "NEW_USER";
      registrationToken: string;
    };

/**
 * 회원가입 요청 데이터
 */
export interface SignUpRequest {
  nickname: string;
  privacyPolicy: boolean;
  termsOfService: boolean;
  locationInfo: boolean;
  marketingEmail?: boolean;
  deviceInfo: {
    deviceUniqueId: string;
    deviceType: "WEB" | "IOS" | "ANDROID";
  };
}

export interface SignUpResult {
  userId: number;
  nickname: string;
  accessToken: string;
  refreshToken: string;
}

/**
 * Auth Service Interface
 */
export interface AuthService {
  /**
   * OAuth 인증 URL 조회
   */
  getOAuthAuthorizeUrl(
    provider: OAuthProvider,
    redirectUri: string,
  ): Promise<string>;

  /**
   * OAuth 로그인
   */
  loginWithOAuth(
    provider: OAuthProvider,
    code: string,
    redirectUri: string,
  ): Promise<LoginResult>;

  signUpWithSocial(
    registrationToken: string,
    data: SignUpRequest,
  ): Promise<SignUpResult>;

  /**
   * 로그아웃
   */
  logout(): Promise<void>;

  /**
   * 토큰 갱신
   */
  refreshToken(): Promise<boolean>;

  /**
   * 현재 사용자 세션 조회
   */
  getCurrentSession(): Promise<{
    userId?: number;
    nickname?: string;
    accessToken: string;
  } | null>;
}

/**
 * Auth Service Implementation
 */
export class AuthServiceImpl implements AuthService {
  constructor(
    private readonly repository: AuthRepository,
    public readonly sessionManager: SessionManager,
  ) {}

  /**
   * OAuth 인증 URL 조회
   */
  async getOAuthAuthorizeUrl(
    provider: OAuthProvider,
    redirectUri: string,
  ): Promise<string> {
    let response:
      | Awaited<ReturnType<AuthRepository["getGoogleAuthorizeUrl"]>>
      | Awaited<ReturnType<AuthRepository["getKakaoAuthorizeUrl"]>>
      | Awaited<ReturnType<AuthRepository["getNaverAuthorizeUrl"]>>;

    switch (provider) {
      case "google":
        response = await this.repository.getGoogleAuthorizeUrl({
          redirectUri,
        });
        break;
      case "kakao":
        response = await this.repository.getKakaoAuthorizeUrl({ redirectUri });
        break;
      case "naver":
        response = await this.repository.getNaverAuthorizeUrl({ redirectUri });
        break;
    }

    if (!response.success || !response.data?.authorizeUrl) {
      throw new Error("Failed to get authorize URL");
    }

    return response.data.authorizeUrl;
  }

  /**
   * OAuth 로그인
   */
  async loginWithOAuth(
    provider: OAuthProvider,
    code: string,
    redirectUri: string,
  ): Promise<LoginResult> {
    const deviceId = await this.sessionManager.getDeviceId();

    const deviceInfo = {
      deviceUniqueId: deviceId,
      deviceType: "WEB" as const,
    };

    let response:
      | Awaited<ReturnType<AuthRepository["loginWithGoogle"]>>
      | Awaited<ReturnType<AuthRepository["loginWithKakao"]>>
      | Awaited<ReturnType<AuthRepository["loginWithNaver"]>>;

    switch (provider) {
      case "google":
        response = await this.repository.loginWithGoogle({
          code,
          redirectUri,
          deviceInfo,
        });
        break;
      case "kakao":
        response = await this.repository.loginWithKakao({
          code,
          redirectUri,
          deviceInfo,
        });
        break;
      case "naver":
        response = await this.repository.loginWithNaver({
          code,
          redirectUri,
          deviceInfo,
        });
        break;
    }

    if (!response.data.success || !response.data.data) {
      throw new Error("Login failed");
    }

    const data = response.data.data;

    // 기존 회원
    if ("status" in data && data.status === "EXISTING_USER") {
      if (
        !data.accessToken ||
        !data.refreshToken ||
        !data.userId ||
        !data.nickname
      ) {
        throw new Error("Invalid login response");
      }

      // 세션 저장 (Token + userId)
      await this.sessionManager.saveSession({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        userId: data.userId,
      });

      return {
        type: "EXISTING_USER",
        userId: data.userId,
        nickname: data.nickname,
      };
    }

    // 신규 회원
    if ("status" in data && data.status === "NEW_USER") {
      if (!data.registrationToken) {
        throw new Error("Invalid registration response");
      }

      return {
        type: "NEW_USER",
        registrationToken: data.registrationToken,
      };
    }

    throw new Error("Unknown login response type");
  }

  async signUpWithSocial(
    registrationToken: string,
    data: SignUpRequest,
  ): Promise<SignUpResult> {
    const response = await this.repository.signUpWithSocial(
      {
        nickname: data.nickname,
        privacyPolicy: data.privacyPolicy,
        termsOfService: data.termsOfService,
        locationInfo: data.locationInfo,
        marketingEmail: data.marketingEmail,
        deviceInfo: data.deviceInfo,
      },
      registrationToken,
    );

    if (!response.data.success || !response.data.data) {
      throw new Error("Sign up failed");
    }

    const signUpData = response.data.data;

    if (
      !signUpData.userId ||
      !signUpData.nickname ||
      !signUpData.accessToken ||
      !signUpData.refreshToken
    ) {
      throw new Error("Invalid sign up response");
    }

    return {
      userId: signUpData.userId,
      nickname: signUpData.nickname,
      accessToken: signUpData.accessToken,
      refreshToken: signUpData.refreshToken,
    };
  }

  /**
   * 로그아웃
   */
  async logout(): Promise<void> {
    const refreshToken = await this.sessionManager.getRefreshToken();
    const deviceId = await this.sessionManager.getDeviceId();

    if (refreshToken && deviceId) {
      try {
        await this.repository.logout(refreshToken, deviceId);
      } catch (error) {
        // 로그아웃 API 실패해도 로컬 세션은 삭제
        console.error("Logout API failed:", error);
      }
    }

    // 세션 삭제
    await this.sessionManager.clearSession();
  }

  /**
   * 토큰 갱신
   */
  async refreshToken(): Promise<boolean> {
    const refreshToken = await this.sessionManager.getRefreshToken();
    const deviceId = await this.sessionManager.getDeviceId();

    if (!refreshToken || !deviceId) {
      return false;
    }

    try {
      const response = await this.repository.refreshToken(
        refreshToken,
        deviceId,
      );

      if (!response.data.success || !response.data.data) {
        return false;
      }

      const data = response.data.data;

      if (!data.accessToken || !data.refreshToken) {
        return false;
      }

      // 토큰만 갱신
      await this.sessionManager.saveSession({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });

      return true;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return false;
    }
  }

  /**
   * 현재 사용자 세션 조회
   */
  async getCurrentSession(): Promise<{
    userId?: number;
    accessToken: string;
  } | null> {
    const session = await this.sessionManager.getSession();

    if (!session) {
      return null;
    }

    return {
      userId: session.userId,
      accessToken: session.accessToken,
    };
  }
}
