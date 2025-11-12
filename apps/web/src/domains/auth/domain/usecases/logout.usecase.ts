import type { SessionManager } from "@core/infrastructure/storage/session-manager";
import { AUTH_ERROR_CODES, AuthError } from "../errors/auth-error";
import type { AuthRepository } from "../repositories/auth-repository";

export interface LogoutUseCase {
  execute(): Promise<void>;
}

export class LogoutUseCaseImpl implements LogoutUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly sessionManager: SessionManager,
  ) {}

  async execute(): Promise<void> {
    try {
      const currentSession = await this.sessionManager.getSession();

      if (!currentSession) {
        return;
      }

      const deviceId = await this.sessionManager.getDeviceId();

      await this.authRepository.logout({
        refreshToken: currentSession.refreshToken,
        deviceId,
      });

      await this.sessionManager.clearSession();
    } catch (error) {
      await this.sessionManager.clearSession();

      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): AuthError {
    if (error instanceof AuthError) {
      return error;
    }

    if (error instanceof Error) {
      return new AuthError(
        error.message || "Failed to logout",
        AUTH_ERROR_CODES.SESSION_EXPIRED,
        error,
      );
    }

    return new AuthError(
      "Unknown error occurred during logout",
      AUTH_ERROR_CODES.SESSION_EXPIRED,
      error,
    );
  }
}
