import type { SessionManager } from "@core/infrastructure/storage/session-manager";
import { SESSION_CONFIG } from "../config/constants";
import type { Session } from "../entities/session.entity";
import { AUTH_ERROR_CODES, AuthError } from "../errors/auth-error";
import type { AuthRepository } from "../repositories/auth-repository";

export type RefreshTokenResult =
  | { success: true; accessToken: string }
  | { success: false };

export interface RefreshTokenUseCase {
  execute(): Promise<RefreshTokenResult>;
  shouldRefresh(session: Session): Promise<boolean>;
}

export class RefreshTokenUseCaseImpl implements RefreshTokenUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly sessionManager: SessionManager,
  ) {}

  async execute(): Promise<RefreshTokenResult> {
    try {
      const refreshToken = await this.sessionManager.getRefreshToken();
      const userId = await this.sessionManager.getUserId();

      if (!refreshToken || !userId) {
        return { success: false };
      }

      const deviceId = await this.sessionManager.getDeviceId();

      const newSession = await this.authRepository.refreshToken({
        refreshToken,
        deviceId,
      });

      const accessToken = newSession.getAccessToken();

      await this.sessionManager.saveSession({
        accessToken,
        refreshToken: newSession.getRefreshToken(),
        userId,
      });

      return { success: true, accessToken };
    } catch (error) {
      const shouldClearSession = this.shouldClearSessionOnError(error);

      if (shouldClearSession) {
        await this.sessionManager.clearSession();
      }

      throw this.handleError(error);
    }
  }

  async shouldRefresh(session: Session): Promise<boolean> {
    return session.willExpireSoon(
      SESSION_CONFIG.TOKEN_REFRESH_THRESHOLD_MINUTES,
    );
  }

  private shouldClearSessionOnError(error: unknown): boolean {
    // ✅ Domain Layer: 비즈니스 에러 코드만 확인 (HTTP 상태 코드 제거)
    if (error instanceof AuthError) {
      const clearCodes = [
        AUTH_ERROR_CODES.SESSION_EXPIRED,
        AUTH_ERROR_CODES.INVALID_TOKEN,
        AUTH_ERROR_CODES.UNAUTHORIZED_ACCESS,
        AUTH_ERROR_CODES.AUTHENTICATION_REQUIRED,
      ] as const;
      return (clearCodes as readonly string[]).includes(error.code);
    }

    return false;
  }

  private handleError(error: unknown): AuthError {
    if (error instanceof AuthError) {
      return error;
    }

    if (error instanceof Error) {
      return new AuthError(
        error.message || "Failed to refresh token",
        AUTH_ERROR_CODES.TOKEN_REFRESH_FAILED,
        error,
      );
    }

    return new AuthError(
      "Unknown error occurred during token refresh",
      AUTH_ERROR_CODES.TOKEN_REFRESH_FAILED,
      error,
    );
  }
}
