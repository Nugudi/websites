import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createAuthServerContainer } from "@/src/di/auth-server-container";
import { logger } from "@/src/shared/infrastructure/logging/logger";

const PUBLIC_PATHS = ["/auth", "/api/auth"];
const LOGIN_PATH = "/auth/login";
const HOME_PATH = "/";

/**
 * 인증이 필요 없는 public 경로인지 확인
 */
function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((path) => pathname.startsWith(path));
}

/**
 * Auth 페이지 경로인지 확인 (로그인한 사용자는 접근 불가)
 */
function isAuthPage(pathname: string): boolean {
  return pathname.startsWith("/auth");
}

/**
 * 로그인 페이지로 리다이렉트 (원래 경로를 callbackUrl로 저장)
 */
function redirectToLogin(request: NextRequest): NextResponse {
  const loginUrl = new URL(LOGIN_PATH, request.url);

  // 로그인 후 돌아갈 경로 저장 (로그인 페이지 자체는 제외)
  if (request.nextUrl.pathname !== LOGIN_PATH) {
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
  }

  return NextResponse.redirect(loginUrl);
}

/**
 * Next.js Middleware (Authentication Guard + Preventive Refresh + Auth Page Protection)
 *
 * 책임 (SRP):
 * - SSR에 적합한 인증 상태 준비
 *   1. Refresh Token 존재 여부 확인 (Guard)
 *   2. Access Token 없으면 미리 갱신 (Preventive Refresh)
 *   3. 로그인 사용자가 /auth 페이지 접근 시 홈으로 리다이렉트
 *
 * Why Preventive Refresh?
 * - Server Component에서는 Cookie 수정 불가
 * - SSR Prefetch 전에 Token을 미리 갱신하면 401 방지
 * - Middleware는 Cookie 수정 가능 (Route Handler와 동일한 권한)
 *
 * 책임이 아닌 것 (다른 레이어로 위임):
 * - Token 갱신 로직: RefreshTokenService가 담당
 * - BFF 호출: RefreshTokenService가 Spring API 직접 호출
 * - Client-side 401 처리: AuthenticatedHttpClient의 401 Interceptor가 담당
 *
 * 동작 흐름:
 * 1. /auth 페이지 접근 시 → Refresh Token 있으면 홈으로 리다이렉트 ✅
 * 2. Protected 페이지 → Refresh Token 체크 → Access Token 없으면 갱신 ✅
 * 3. HomePage SSR Prefetch: Token 이미 준비됨 → UserService.getMyProfile() 성공 ✅
 * 4. 초기 렌더링: "매튜" 표시 ✅
 * 5. Client-side 요청 시 401 발생: AuthenticatedHttpClient가 자동 재시도 (Fallback)
 */
export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const container = createAuthServerContainer();
  const sessionManager = container.getSessionManager();
  const refreshToken = await sessionManager.getRefreshToken();

  // 1. Auth 페이지 접근 시: 로그인한 사용자는 홈으로 리다이렉트
  if (isAuthPage(pathname)) {
    if (refreshToken) {
      logger.info(
        "Logged-in user tried to access auth page, redirecting to home",
        {
          pathname,
        },
      );
      return NextResponse.redirect(new URL(HOME_PATH, request.url));
    }
    // 비로그인 사용자는 /auth 접근 허용
    return NextResponse.next();
  }

  // 2. Public 경로 (API Routes 등)는 인증 체크 생략
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // 3. Protected 경로: 인증 상태 확인 및 Token 갱신
  try {
    if (!refreshToken) {
      logger.info("Refresh Token not found, redirecting to login", {
        pathname,
      });
      return redirectToLogin(request);
    }

    // 2. Access Token 체크 (Preventive Refresh)
    let accessToken = await sessionManager.getAccessToken();

    if (!accessToken) {
      logger.info("Access Token not found, attempting preventive refresh", {
        pathname,
      });

      // RefreshTokenService로 즉시 갱신 (Middleware는 Cookie 수정 가능)
      const refreshTokenService = container.getRefreshTokenService();
      const result = await refreshTokenService.refresh();

      if (!result.success) {
        logger.warn("Preventive refresh failed, redirecting to login", {
          pathname,
          error: result.error,
        });
        return redirectToLogin(request);
      }

      logger.info("Preventive refresh succeeded, proceeding to SSR", {
        pathname,
      });

      // 갱신된 Token을 다시 조회 (Cookie에 저장됨)
      accessToken = await sessionManager.getAccessToken();
    }

    // Access Token이 준비되었으므로 SSR Prefetch 진행
    // IMPORTANT: Cookie 스냅샷 문제로 인해 Request Headers에 Token 추가
    // Server Component는 요청 시작 시점의 Cookie만 읽으므로,
    // Middleware에서 갱신한 Token을 Headers로 전달
    const response = NextResponse.next();

    if (accessToken) {
      response.headers.set("x-access-token", accessToken);
      logger.debug("Added access token to request headers for SSR", {
        pathname,
      });
    }

    return response;
  } catch (error) {
    // 예외 발생 시 로그 기록 후 로그인 페이지로
    logger.error("Unexpected error in middleware", {
      error: error instanceof Error ? error.message : String(error),
      pathname,
    });
    return redirectToLogin(request);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     */
    "/((?!_next/static|_next/image|favicon.ico|images).*)",
  ],
};
