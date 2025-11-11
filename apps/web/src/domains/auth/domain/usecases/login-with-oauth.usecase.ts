import type { SessionManager } from "@core/infrastructure/storage/session-manager";
import type { User } from "../entities/user.entity";
import { AUTH_ERROR_CODES, AuthError } from "../errors/auth-error";
import type {
  AuthRepository,
  LoginResult as RepositoryLoginResult,
} from "../repositories/auth-repository";
import type { OAuthProvider } from "../types/common";

export interface LoginWithOAuthParams {
  provider: OAuthProvider;
  code: string;
  redirectUri: string;
}

export type LoginWithOAuthResult =
  | { type: "EXISTING_USER"; user: User }
  | { type: "NEW_USER"; registrationToken: string };

export interface LoginWithOAuthUseCase {
  execute(params: LoginWithOAuthParams): Promise<LoginWithOAuthResult>;
}

export class LoginWithOAuthUseCaseImpl implements LoginWithOAuthUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly sessionManager: SessionManager,
  ) {}

  async execute(params: LoginWithOAuthParams): Promise<LoginWithOAuthResult> {
    this.validateParams(params);
    const deviceId = await this.sessionManager.getDeviceId();

    try {
      const result = await this.loginByProvider(params, deviceId);
      return result;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private validateParams(params: LoginWithOAuthParams): void {
    if (!params.code) {
      throw new AuthError("Authorization code is required", "INVALID_CODE");
    }

    if (!params.redirectUri) {
      throw new AuthError("Redirect URI is required", "INVALID_CODE");
    }

    const supportedProviders: OAuthProvider[] = ["google", "kakao", "naver"];
    if (!supportedProviders.includes(params.provider)) {
      throw new AuthError(
        `Unsupported provider: ${params.provider}`,
        "INVALID_CODE",
      );
    }
  }

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

  private async handleGoogleLogin(
    params: LoginWithOAuthParams,
    deviceId: string,
  ): Promise<LoginWithOAuthResult> {
    const result = await this.authRepository.loginWithGoogle({
      code: params.code,
      redirectUri: params.redirectUri,
      deviceInfo: { deviceId },
    });

    return this.processLoginResult(result);
  }

  private async handleKakaoLogin(
    params: LoginWithOAuthParams,
    deviceId: string,
  ): Promise<LoginWithOAuthResult> {
    const result = await this.authRepository.loginWithKakao({
      code: params.code,
      redirectUri: params.redirectUri,
      deviceInfo: { deviceId },
    });

    return this.processLoginResult(result);
  }

  private async handleNaverLogin(
    params: LoginWithOAuthParams,
    deviceId: string,
  ): Promise<LoginWithOAuthResult> {
    const result = await this.authRepository.loginWithNaver({
      code: params.code,
      redirectUri: params.redirectUri,
      deviceInfo: { deviceId },
    });

    return this.processLoginResult(result);
  }

  private async processLoginResult(
    result: RepositoryLoginResult,
  ): Promise<LoginWithOAuthResult> {
    if (result.type === "EXISTING_USER") {
      await this.sessionManager.saveSession({
        accessToken: result.session.getAccessToken(),
        refreshToken: result.session.getRefreshToken(),
        userId: result.user.getUserId(),
      });

      return {
        type: "EXISTING_USER",
        user: result.user,
      };
    }

    return {
      type: "NEW_USER",
      registrationToken: result.registrationToken,
    };
  }

  private handleError(error: unknown): AuthError {
    if (error instanceof AuthError) {
      return error;
    }

    if (error instanceof Error) {
      return new AuthError(
        error.message || "Failed to login with OAuth",
        AUTH_ERROR_CODES.INVALID_CODE,
        error,
      );
    }

    return new AuthError(
      "Unknown error occurred during OAuth login",
      AUTH_ERROR_CODES.INVALID_CODE,
      error,
    );
  }
}
