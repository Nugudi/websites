import type { RefreshTokenProvider } from "@/src/shared/infrastructure/auth/refresh-token-provider.interface";
import { logger } from "@/src/shared/infrastructure/logging/logger";
import type { ServerSessionManager } from "@/src/shared/infrastructure/storage/server-session-manager";

/**
 * Refresh Token Service (BFF 전용)
 *
 * 책임 (SRP):
 * - BFF Route에서만 사용하는 Refresh Token 전용 Service
 * - Spring API 직접 호출 (AuthenticatedHttpClient 우회하여 무한 루프 방지)
 * - SessionManager를 통한 토큰 관리
 *
 * Why not AuthenticatedHttpClient?
 * - AuthenticatedHttpClient는 401 발생 시 /api/auth/refresh를 호출
 * - BFF Route가 AuthenticatedHttpClient를 사용하면 무한 루프 발생
 * - 따라서 BFF는 fetch()로 Spring API를 직접 호출해야 함
 *
 * DDD Layer:
 * - Application Layer (Service)
 * - Infrastructure Layer에 의존 (SessionManager)
 *
 * DIP (Dependency Inversion Principle):
 * - RefreshTokenProvider 인터페이스 구현
 * - Infrastructure Layer가 이 Service를 직접 의존하지 않고 인터페이스 의존
 */
export class RefreshTokenService implements RefreshTokenProvider {
  constructor(
    private readonly sessionManager: ServerSessionManager,
    private readonly springApiUrl: string,
  ) {}

  /**
   * Refresh Token 실행
   *
   * @returns { success: boolean, error?: string }
   */
  async refresh(): Promise<{ success: boolean; error?: string }> {
    try {
      // 1. SessionManager에서 Refresh Token과 Device ID 조회
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

      // 2. Spring API 직접 호출 (AuthenticatedHttpClient 우회)
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

      // 3. 응답 검증
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

      // 4. SessionManager를 통해 새 토큰 저장 (기존 userId 유지)
      const currentSession = await this.sessionManager.getSession();

      await this.sessionManager.saveSession({
        accessToken,
        refreshToken: newRefreshToken,
        userId: currentSession?.userId,
      });

      logger.info("Token refreshed successfully via Spring API");

      return { success: true };
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
