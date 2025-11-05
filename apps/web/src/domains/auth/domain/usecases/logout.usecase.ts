/**
 * Logout UseCase
 *
 * 로그아웃 비즈니스 로직을 캡슐화
 */

import { AuthError } from "../../core/errors/auth-error";
import type { SessionManager } from "../interfaces/session-manager.interface";
import type { AuthRepository } from "../repositories/auth-repository";

/**
 * Logout UseCase
 */
export class Logout {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly sessionManager: SessionManager,
  ) {}

  /**
   * UseCase 실행
   */
  async execute(): Promise<void> {
    try {
      // 1. 현재 세션 가져오기
      const currentSession = await this.sessionManager.getSession();

      if (!currentSession) {
        // 세션이 없으면 이미 로그아웃 상태
        return;
      }

      // 2. 디바이스 ID 가져오기
      const deviceId = await this.sessionManager.getDeviceId();

      // 3. 서버에 로그아웃 요청 (Repository)
      await this.authRepository.logout({
        refreshToken: currentSession.refreshToken,
        deviceId,
      });

      // 4. 로컬 세션 클리어 (SessionManager)
      await this.sessionManager.clearSession();
    } catch (error) {
      // 로그아웃 실패해도 로컬 세션은 클리어
      await this.sessionManager.clearSession();

      throw this.handleError(error);
    }
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
        error.message || "Failed to logout",
        undefined,
        undefined,
        error,
      );
    }

    return new AuthError(
      "Unknown error occurred during logout",
      undefined,
      undefined,
      error,
    );
  }
}
