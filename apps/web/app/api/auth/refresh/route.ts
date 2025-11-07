import { NextResponse } from "next/server";
import { createAuthServerContainer } from "@/src/domains/auth/di/auth-server-container";
import { logger } from "@/src/shared/infrastructure/logging/logger";

/**
 * Refresh Token API Route (BFF)
 *
 * 책임 (SRP):
 * - HTTP 요청/응답 처리 (Presentation Layer)
 * - RefreshTokenService에 위임 (Application Layer)
 *
 * Why RefreshTokenService?
 * - BFF Route는 Infrastructure 로직(Cookie 관리)을 직접 수행하면 안 됨
 * - RefreshTokenService가 SessionManager를 통해 토큰 관리
 * - Clean Architecture: Presentation → Application → Infrastructure
 *
 * Why not AuthService?
 * - AuthService → AuthRepository → AuthenticatedHttpClient
 * - AuthenticatedHttpClient는 401 시 /api/auth/refresh 호출 (무한 루프)
 * - RefreshTokenService는 fetch()로 Spring API 직접 호출 (무한 루프 방지)
 *
 * @example
 * POST /api/auth/refresh
 * Response: { success: true } | { success: false, error: "..." }
 */
export async function POST() {
  try {
    // 1. Server Container에서 RefreshToken UseCase 획득
    const container = createAuthServerContainer();
    const refreshTokenUseCase = container.getRefreshToken();

    // 2. UseCase에 위임 (BFF는 오케스트레이션만)
    const result = await refreshTokenUseCase.execute();

    if (!result.success) {
      logger.warn("Token refresh failed via RefreshToken UseCase");

      return NextResponse.json(
        { success: false, error: "Token refresh failed" },
        { status: 401 },
      );
    }

    logger.info("Token refreshed successfully via RefreshToken UseCase");

    // 세션에서 갱신된 refreshToken과 userId 가져오기 (Client-side localStorage 동기화용)
    const sessionManager = container.getSessionManager();
    const session = await sessionManager.getSession();

    if (!session) {
      logger.error("Session not found after successful token refresh");
      return NextResponse.json(
        { success: false, error: "Session not found" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        accessToken: result.accessToken, // UseCase에서 반환받은 accessToken 사용
        refreshToken: session.refreshToken,
        userId: session.userId, // Client-side localStorage 동기화를 위해 userId 포함
      },
    });
  } catch (error) {
    logger.error("Unexpected error in refresh BFF route", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
