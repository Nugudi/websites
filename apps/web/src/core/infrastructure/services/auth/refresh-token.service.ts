/**
 * Refresh Token Service
 *
 * 책임 (SRP):
 * - Middleware와 Server-side에서만 사용하는 Refresh Token 전용 Service
 * - Spring API 직접 호출 (AuthenticatedHttpClient 우회하여 무한 루프 방지)
 * - SessionManager를 통한 토큰 관리
 *
 * Why not AuthenticatedHttpClient?
 * - AuthenticatedHttpClient는 401 발생 시 /api/auth/refresh를 호출
 * - Middleware/Server Component가 AuthenticatedHttpClient를 사용하면 무한 루프 발생
 * - 따라서 Server-side는 fetch()로 Spring API를 직접 호출해야 함
 *
 * Clean Architecture Layer:
 * - Infrastructure Layer (Service)
 * - Domain Layer의 SessionManager 인터페이스에 의존
 *
 * Edge Runtime 호환:
 * - 절대 URL 사용 (상대 URL은 Edge Runtime에서 지원 안됨)
 * - Node.js API 사용 안함 (Edge Runtime 제약)
 *
 * ⚠️ ARCHITECTURE NOTE: Auth Infrastructure Layer 예외 처리
 *
 * Auth는 유일하게 domain-specific infrastructure를 가지는 도메인입니다.
 *
 * 이유:
 * - Token refresh는 Auth 도메인에 특화된 로직
 * - 다른 도메인에서는 사용하지 않음
 * - RefreshTokenService는 Auth의 핵심 비즈니스 로직의 일부
 * - Shared infrastructure로 이동 시 불필요한 추상화 증가
 *
 * TODO: 다음 상황에서 재검토 필요
 * 1. Multi-tenant 시스템으로 전환 시
 *    → 여러 인증 제공자를 지원해야 할 경우
 *    → 예: OAuth, SAML, JWT, Session 등 동시 지원
 * 2. Microservices 아키텍처로 분리 시
 *    → Auth가 독립 서비스가 되는 경우
 *    → 예: Auth Service가 별도 배포 단위로 분리
 * 3. 다른 도메인도 domain-specific infrastructure가 필요한 경우
 *    → 패턴의 일관성 검토 필요
 *    → 예: Payment 도메인이 PG사 전용 로직 필요
 *
 * 현재 구조가 옳은 이유:
 * - YAGNI 원칙: 필요한 것만 구현
 * - 단일 인증 시스템이므로 Auth에 위치하는 것이 자연스러움
 * - 현재는 오버엔지니어링 없이 실용적인 구조 유지
 */

import { logger } from "@core/infrastructure/logging/logger";
import type { SessionManager } from "@core/infrastructure/storage/session-manager";

export class RefreshTokenService {
  constructor(
    private readonly sessionManager: SessionManager,
    private readonly springApiUrl: string,
  ) {}

  /**
   * Refresh Token 실행
   *
   * @returns { success: boolean, accessToken?: string, refreshToken?: string, error?: string }
   */
  async refresh(): Promise<{
    success: boolean;
    accessToken?: string;
    refreshToken?: string;
    error?: string;
  }> {
    try {
      const refreshToken = await this.sessionManager.getRefreshToken();
      const deviceId = await this.sessionManager.getDeviceId();

      if (!refreshToken) {
        logger.warn("Refresh token not found in session");
        return { success: false, error: "Refresh token not found" };
      }

      if (!deviceId) {
        logger.warn("Device ID not found");
        return { success: false, error: "Device ID not found" };
      }

      logger.info("Attempting to refresh token via Spring API", {
        hasRefreshToken: !!refreshToken,
        deviceId,
      });

      const response = await fetch(`${this.springApiUrl}/api/v1/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshToken}`,
          "X-Device-ID": deviceId,
        },
      });

      if (!response.ok) {
        logger.warn("Spring refresh API returned error", {
          status: response.status,
          statusText: response.statusText,
        });
        return {
          success: false,
          error: `Spring API error: ${response.status}`,
        };
      }

      const data = await response.json();

      if (!data.success || !data.data) {
        logger.error("Invalid response structure from Spring API", { data });
        return { success: false, error: "Invalid response structure" };
      }

      const { accessToken, refreshToken: newRefreshToken } = data.data;

      if (!accessToken || !newRefreshToken) {
        logger.error("Missing tokens in Spring API response", {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!newRefreshToken,
        });
        return { success: false, error: "Missing tokens in response" };
      }

      const currentSession = await this.sessionManager.getSession();

      if (!currentSession?.userId) {
        logger.error("No userId found in current session during token refresh");
        return { success: false, error: "Missing userId in session" };
      }

      await this.sessionManager.saveSession({
        accessToken,
        refreshToken: newRefreshToken,
        userId: currentSession.userId,
      });

      logger.info("Token refreshed successfully via Spring API");

      return {
        success: true,
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      logger.error("Unexpected error during token refresh", {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}
