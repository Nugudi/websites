/**
 * Login With OAuth UseCase
 *
 * OAuth를 통한 로그인 비즈니스 로직을 캡슐화
 * - 하나의 비즈니스 기능 = 하나의 UseCase
 * - Repository를 통해 데이터 접근
 * - SessionManager를 통해 세션 관리
 */

import { AuthError } from "../../core/errors/auth-error";
import type { OAuthProvider } from "../../core/types/common";
import type { User } from "../entities/user.entity";
import type { SessionManager } from "../interfaces/session-manager.interface";
import type {
  AuthRepository,
  LoginResult as RepositoryLoginResult,
} from "../repositories/auth-repository";

/**
 * UseCase 입력 파라미터
 */
export interface LoginWithOAuthParams {
  provider: OAuthProvider;
  code: string;
  redirectUri: string;
}

/**
 * UseCase 출력 결과
 */
export type LoginWithOAuthResult =
  | { type: "EXISTING_USER"; user: User }
  | { type: "NEW_USER"; registrationToken: string };

/**
 * Login With OAuth UseCase
 */
export interface LoginWithOAuthUseCase {
  execute(params: LoginWithOAuthParams): Promise<LoginWithOAuthResult>;
}

/**
 * Login With OAuth UseCase Implementation
 */
export class LoginWithOAuthUseCaseImpl implements LoginWithOAuthUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly sessionManager: SessionManager,
  ) {}

  /**
   * UseCase 실행
   */
  async execute(params: LoginWithOAuthParams): Promise<LoginWithOAuthResult> {
    // 1. 입력값 검증
    this.validateParams(params);

    // 2. 디바이스 ID 가져오기 (Infrastructure Layer)
    const deviceId = await this.sessionManager.getDeviceId();

    // 3. Provider별 로그인 처리
    try {
      const result = await this.loginByProvider(params, deviceId);
      return result;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * 입력값 검증
   */
  private validateParams(params: LoginWithOAuthParams): void {
    if (!params.code) {
      throw new AuthError("Authorization code is required", "INVALID_CODE");
    }

    if (!params.redirectUri) {
      throw new AuthError("Redirect URI is required", "INVALID_CODE");
    }

    // Validate provider is one of the supported types
    const supportedProviders: OAuthProvider[] = ["google", "kakao", "naver"];
    if (!supportedProviders.includes(params.provider)) {
      throw new AuthError(
        `Unsupported provider: ${params.provider}`,
        "INVALID_CODE",
      );
    }
  }

  /**
   * Provider별 로그인 처리
   */
  private async loginByProvider(
    params: LoginWithOAuthParams,
    deviceId: string,
  ): Promise<LoginWithOAuthResult> {
    switch (params.provider) {
      case "google":
        return this.handleGoogleLogin(params, deviceId);
      case "kakao":
        return this.handleKakaoLogin(params, deviceId);
      case "naver":
        return this.handleNaverLogin(params, deviceId);
      default:
        throw new AuthError(
          `Unsupported provider: ${params.provider}`,
          "INVALID_CODE",
        );
    }
  }

  /**
   * Google 로그인 처리
   */
  private async handleGoogleLogin(
    params: LoginWithOAuthParams,
    deviceId: string,
  ): Promise<LoginWithOAuthResult> {
    // Repository 호출 (Data Layer)
    const result = await this.authRepository.loginWithGoogle({
      code: params.code,
      redirectUri: params.redirectUri,
      deviceInfo: { deviceId },
    });

    return this.processLoginResult(result);
  }

  /**
   * Kakao 로그인 처리
   */
  private async handleKakaoLogin(
    params: LoginWithOAuthParams,
    deviceId: string,
  ): Promise<LoginWithOAuthResult> {
    // Repository 호출 (Data Layer)
    const result = await this.authRepository.loginWithKakao({
      code: params.code,
      redirectUri: params.redirectUri,
      deviceInfo: { deviceId },
    });

    return this.processLoginResult(result);
  }

  /**
   * Naver 로그인 처리
   */
  private async handleNaverLogin(
    params: LoginWithOAuthParams,
    deviceId: string,
  ): Promise<LoginWithOAuthResult> {
    // Repository 호출 (Data Layer)
    const result = await this.authRepository.loginWithNaver({
      code: params.code,
      redirectUri: params.redirectUri,
      deviceInfo: { deviceId },
    });

    return this.processLoginResult(result);
  }

  /**
   * 로그인 결과 처리 공통 로직
   */
  private async processLoginResult(
    result: RepositoryLoginResult,
  ): Promise<LoginWithOAuthResult> {
    // 비즈니스 로직: 기존 사용자 처리
    if (result.type === "EXISTING_USER") {
      // 세션 저장 (Infrastructure Layer)
      await this.sessionManager.saveSession({
        accessToken: result.session.accessToken,
        refreshToken: result.session.refreshToken,
        userId: result.user.userId,
      });

      return {
        type: "EXISTING_USER",
        user: result.user,
      };
    }

    // 비즈니스 로직: 신규 사용자 처리
    return {
      type: "NEW_USER",
      registrationToken: result.registrationToken,
    };
  }

  /**
   * 에러 처리
   */
  private handleError(error: unknown): AuthError {
    if (error instanceof AuthError) {
      return error;
    }

    if (error instanceof Error) {
      return new AuthError(
        error.message || "Failed to login with OAuth",
        "INVALID_CODE",
        undefined,
        error,
      );
    }

    return new AuthError(
      "Unknown error occurred during OAuth login",
      "INVALID_CODE",
      undefined,
      error,
    );
  }
}
