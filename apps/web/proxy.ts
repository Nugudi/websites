import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@/src/domains/auth/auth-server";
import { SESSION_COOKIE_MAX_AGE } from "@/src/domains/auth/constants/session";
import { AuthError } from "@/src/domains/auth/errors/auth-error";
import { isTokenExpired } from "@/src/domains/auth/utils/jwt";
import { logger } from "@/src/shared/utils/logger";

const PUBLIC_PATHS = ["/auth", "/api/auth"];
const LOGIN_PATH = "/auth/login";
const SESSION_COOKIE_NAME = "nugudi.session";

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

  const response = NextResponse.redirect(loginUrl);
  response.cookies.delete(SESSION_COOKIE_NAME);
  return response;
}

/**
 * 세션 쿠키 설정
 */
function setSessionCookie(
  response: NextResponse,
  encryptedSession: string,
): void {
  response.cookies.set(SESSION_COOKIE_NAME, encryptedSession, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_COOKIE_MAX_AGE,
  });
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public 경로는 인증 체크 생략
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  try {
    // 세션 조회 (갱신하지 않음)
    const session = await auth.getSession({ refresh: false });

    // 세션이 없으면 로그인 페이지로
    if (!session) {
      return redirectToLogin(request);
    }

    // Access Token이 유효하면 통과
    if (!isTokenExpired(session.tokenSet.accessToken)) {
      return NextResponse.next();
    }

    // Access Token 만료 시 갱신 시도
    const encryptedSession = await auth.refreshAndGetEncryptedSession(session);

    // 갱신 실패 시 로그인 페이지로
    if (!encryptedSession) {
      return redirectToLogin(request);
    }

    // 갱신 성공 시 새 쿠키 설정 후 통과
    const response = NextResponse.next();
    setSessionCookie(response, encryptedSession);
    return response;
  } catch (error) {
    // 예외 발생 시 로그 기록 후 로그인 페이지로
    if (error instanceof AuthError) {
      // 구조화된 AuthError는 상세 정보와 함께 로깅
      logger.error("Authentication error in proxy", {
        code: error.code,
        message: error.message,
        context: error.context,
        pathname,
      });
    } else {
      // 일반 에러는 기존 방식대로 로깅
      logger.error("Unexpected error in proxy", {
        error: error instanceof Error ? error.message : String(error),
        pathname,
      });
    }
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
