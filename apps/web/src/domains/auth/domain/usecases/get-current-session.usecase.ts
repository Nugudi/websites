import { AuthError } from "../../core/errors/auth-error";
import type { Session } from "../entities/session.entity";
import { SessionEntity } from "../entities/session.entity";
import type { SessionManager } from "../interfaces/session-manager.interface";

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
        undefined,
        undefined,
        error,
      );
    }

    return new AuthError(
      "Unknown error occurred while getting session",
      undefined,
      undefined,
      error,
    );
  }
}
