/**
 * Refresh Token UseCase
 *
 * 액세스 토큰 갱신 비즈니스 로직을 캡슐화
 */

import { SESSION_CONFIG } from "../../core/config/constants";
import { AuthError } from "../../core/errors/auth-error";
import type { Session } from "../entities/session.entity";
import type { SessionManager } from "../interfaces/session-manager.interface";
import type { AuthRepository } from "../repositories/auth-repository";

/**
 * RefreshToken UseCase
 */
export class RefreshToken {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly sessionManager: SessionManager,
  ) {}

  /**
   * UseCase 실행
   * @returns 갱신 성공 여부
   */
  async execute(): Promise<boolean> {
    try {
      // 1. 현재 세션 가져오기
      const currentSession = await this.sessionManager.getSession();

      if (!currentSession?.refreshToken) {
        // 세션이 없거나 refresh token이 없으면 실패
        return false;
      }

      // 2. 디바이스 ID 가져오기
      const deviceId = await this.sessionManager.getDeviceId();

      // 3. 토큰 갱신 요청 (Repository)
      const newSession = await this.authRepository.refreshToken({
        refreshToken: currentSession.refreshToken,
        deviceId,
      });

      // 4. 새 세션 저장 (SessionManager)
      await this.sessionManager.saveSession({
        accessToken: newSession.accessToken,
        refreshToken: newSession.refreshToken,
        userId: currentSession.userId,
      });

      return true;
    } catch (error) {
      // 토큰 갱신 실패 시 세션 클리어
      await this.sessionManager.clearSession();

      throw this.handleError(error);
    }
  }

  /**
   * 세션이 갱신이 필요한지 확인
   * (토큰 만료 임박 여부 체크)
   */
  async shouldRefresh(session: Session): Promise<boolean> {
    // 세션이 만료되었거나 곧 만료될 예정인지 확인
    return session.willExpireSoon(
      SESSION_CONFIG.TOKEN_REFRESH_THRESHOLD_MINUTES,
    );
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
