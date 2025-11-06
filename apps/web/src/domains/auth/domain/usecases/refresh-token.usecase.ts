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
 * RefreshToken 결과 타입
 */
export type RefreshTokenResult =
  | { success: true; accessToken: string }
  | { success: false };

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
   * @returns 갱신 성공 여부 및 새로운 accessToken
   */
  async execute(): Promise<RefreshTokenResult> {
    try {
      // 1. Refresh Token과 User ID 가져오기
      // NOTE: getSession() 대신 개별 메서드 사용
      // - getSession()은 accessToken이 없으면 null 반환
      // - 토큰 갱신 시에는 refreshToken과 userId만 필요
      const refreshToken = await this.sessionManager.getRefreshToken();
      const userId = await this.sessionManager.getUserId();

      if (!refreshToken || !userId) {
        // refresh token이나 userId가 없으면 실패
        return { success: false };
      }

      // 2. 디바이스 ID 가져오기
      const deviceId = await this.sessionManager.getDeviceId();

      // 3. 토큰 갱신 요청 (Repository)
      const newSession = await this.authRepository.refreshToken({
        refreshToken,
        deviceId,
      });

      const accessToken = newSession.accessToken;

      // 4. 새 세션 저장 (SessionManager)
      await this.sessionManager.saveSession({
        accessToken,
        refreshToken: newSession.refreshToken,
        userId,
      });

      return { success: true, accessToken };
    } catch (error) {
      // 에러 타입에 따라 세션 클리어 여부 결정
      const shouldClearSession = this.shouldClearSessionOnError(error);

      if (shouldClearSession) {
        // 토큰이 무효한 경우에만 세션 클리어 (401, 403)
        await this.sessionManager.clearSession();
      }

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
   * 에러 발생 시 세션을 클리어해야 하는지 판단
   *
   * - 401/403: 토큰이 무효하거나 만료됨 → 세션 클리어 필요
   * - 네트워크/서버 에러: 일시적 오류일 수 있음 → 세션 유지
   */
  private shouldClearSessionOnError(error: unknown): boolean {
    // HttpError의 status 코드 확인 (FetchHttpClient에서 발생)
    if (error && typeof error === "object" && "status" in error) {
      const status = (error as { status: number }).status;
      // 401: Unauthorized, 403: Forbidden → 토큰 무효
      return status === 401 || status === 403;
    }

    // AuthError의 코드 확인
    if (error instanceof AuthError) {
      // 특정 에러 코드만 세션 클리어
      const clearCodes = ["TOKEN_EXPIRED", "INVALID_TOKEN", "UNAUTHORIZED"];
      return error.code ? clearCodes.includes(error.code) : false;
    }

    // 기타 에러 (네트워크, 타임아웃 등)는 세션 유지
    // 사용자가 재시도할 수 있도록
    return false;
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
