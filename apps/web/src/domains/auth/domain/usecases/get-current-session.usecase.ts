/**
 * Get Current Session UseCase
 *
 * 현재 세션 정보를 가져오는 비즈니스 로직
 */

import { AuthError } from "../../core/errors/auth-error";
import type { Session } from "../entities/session.entity";
import { SessionEntity } from "../entities/session.entity";
import type { SessionManager } from "../interfaces/session-manager.interface";

/**
 * UseCase 출력 결과
 */
export interface CurrentSessionResult {
  session: Session | null;
  isAuthenticated: boolean;
}

/**
 * Get Current Session UseCase
 */
export interface GetCurrentSessionUseCase {
  execute(): Promise<Session | null>;
}

/**
 * Get Current Session UseCase Implementation
 */
export class GetCurrentSessionUseCaseImpl implements GetCurrentSessionUseCase {
  constructor(private readonly sessionManager: SessionManager) {}

  /**
   * UseCase 실행
   */
  async execute(): Promise<Session | null> {
    try {
      // SessionManager에서 세션 가져오기
      const sessionData = await this.sessionManager.getSession();

      if (!sessionData) {
        return null;
      }

      // 세션 Entity 생성
      // Note: expiresAt은 SessionManager가 저장할 때 같이 저장되어 있어야 함
      // 현재는 간단하게 1시간 후로 설정
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1);

      const session = new SessionEntity({
        accessToken: sessionData.accessToken,
        refreshToken: sessionData.refreshToken,
        userId: sessionData.userId,
        expiresAt,
      });

      // 세션 유효성 검증
      if (session.isExpired()) {
        return null;
      }

      return session;
    } catch (error) {
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
