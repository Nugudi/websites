import type { SessionManager } from "@core/infrastructure/storage/session-manager";
import type { Session } from "../entities/session.entity";
import { SessionEntity } from "../entities/session.entity";
import { AUTH_ERROR_CODES, AuthError } from "../errors/auth-error";

export interface CurrentSessionResult {
  session: Session | null;
  isAuthenticated: boolean;
}

export interface GetCurrentSessionUseCase {
  execute(): Promise<Session | null>;
}

export class GetCurrentSessionUseCaseImpl implements GetCurrentSessionUseCase {
  constructor(private readonly sessionManager: SessionManager) {}

  async execute(): Promise<Session | null> {
    try {
      const sessionData = await this.sessionManager.getSession();

      if (!sessionData) {
        return null;
      }

      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1);

      const session = new SessionEntity({
        accessToken: sessionData.accessToken,
        refreshToken: sessionData.refreshToken,
        userId: sessionData.userId,
        expiresAt,
      });

      if (session.isExpired()) {
        return null;
      }

      return session;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): AuthError {
    if (error instanceof AuthError) {
      return error;
    }

    if (error instanceof Error) {
      return new AuthError(
        error.message || "Failed to get current session",
        AUTH_ERROR_CODES.SESSION_EXPIRED,
        error,
      );
    }

    return new AuthError(
      "Unknown error occurred while getting session",
      AUTH_ERROR_CODES.SESSION_EXPIRED,
      error,
    );
  }
}
