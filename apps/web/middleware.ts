import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createAuthServerContainer } from "@/src/di/auth-server-container";
import { logger } from "@/src/shared/infrastructure/logging/logger";

const PUBLIC_PATHS = ["/auth", "/api/auth"];
const LOGIN_PATH = "/auth/login";

/**
 * 인증이 필요 없는 public 경로인지 확인
 */
function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((path) => pathname.startsWith(path));
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
 * Access Token이 만료되었는지 확인
 * JWT 디코딩하여 exp 필드 확인
 */
function isTokenExpired(token: string): boolean {
  try {
    const [, payload] = token.split(".");
    if (!payload) return true;

    const decoded = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf-8"),
    );
    const exp = decoded.exp;

    if (!exp) return true;

    // exp는 초 단위, Date.now()는 밀리초 단위
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public 경로는 인증 체크 생략
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  try {
    const container = createAuthServerContainer();
    const authService = container.getAuthService();

    // 세션 조회
    const session = await authService.getCurrentSession();

    // 세션이 없으면 로그인 페이지로
    if (!session) {
      return redirectToLogin(request);
    }

    // Access Token이 유효하면 통과
    if (!isTokenExpired(session.accessToken)) {
      return NextResponse.next();
    }

    // Access Token 만료 시 갱신 시도
    const refreshed = await authService.refreshToken();

    // 갱신 실패 시 로그인 페이지로
    if (!refreshed) {
      return redirectToLogin(request);
    }

    // 갱신 성공 시 통과
    return NextResponse.next();
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
