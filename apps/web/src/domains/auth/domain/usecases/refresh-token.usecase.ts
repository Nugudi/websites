import { SESSION_CONFIG } from "../../core/config/constants";
import { AuthError } from "../../core/errors/auth-error";
import type { Session } from "../entities/session.entity";
import type { SessionManager } from "../interfaces/session-manager.interface";
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
    if (error && typeof error === "object" && "status" in error) {
      const status = (error as { status: number }).status;
      return status === 401 || status === 403;
    }

    if (error instanceof AuthError) {
      const clearCodes = ["TOKEN_EXPIRED", "INVALID_TOKEN", "UNAUTHORIZED"];
      return error.code ? clearCodes.includes(error.code) : false;
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
        "REFRESH_FAILED",
        undefined,
        error,
      );
    }

    return new AuthError(
      "Unknown error occurred during token refresh",
      "REFRESH_FAILED",
      undefined,
      error,
    );
  }
}
