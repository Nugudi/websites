import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
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

  // Edge Runtime에서 명시적으로 API URL 전달 (환경변수가 비어있으면 에러 발생)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    logger.error(
      "[Middleware] NEXT_PUBLIC_API_URL is not set. Cannot proceed with authentication.",
      { pathname },
    );
    throw new Error(
      "NEXT_PUBLIC_API_URL environment variable is required for middleware to function. " +
        "Please check your .env file.",
    );
  }

  // 미들웨어에서는 NextRequest의 cookies를 직접 사용
  const refreshToken = request.cookies.get("refresh_token")?.value;
  const userId = request.cookies.get("user_id")?.value;

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
    if (!refreshToken || !userId) {
      logger.info("Refresh Token or User ID not found, redirecting to login", {
        pathname,
      });
      return redirectToLogin(request);
    }

    // 2. Access Token 체크 (Preventive Refresh)
    let accessToken = request.cookies.get("access_token")?.value;

    if (!accessToken) {
      logger.info("Access Token not found, attempting preventive refresh", {
        pathname,
      });

      // deviceId 조회 또는 생성
      let deviceId = request.cookies.get("device_id")?.value;
      if (!deviceId) {
        deviceId = crypto.randomUUID();
      }

      // 직접 API 호출하여 토큰 갱신
      try {
        const response = await fetch(`${apiUrl}/api/v1/auth/refresh`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${refreshToken}`,
            "X-Device-ID": deviceId,
          },
          body: JSON.stringify({}),
        });

        if (!response.ok) {
          throw new Error(`Token refresh failed: ${response.status}`);
        }

        const data = await response.json();
        const newAccessToken = data.data?.accessToken;
        const newRefreshToken = data.data?.refreshToken;

        if (!newAccessToken || !newRefreshToken) {
          throw new Error("Token refresh response is missing tokens");
        }

        // Type assertion: we've validated these tokens exist
        accessToken = newAccessToken as string;

        logger.info("Preventive refresh succeeded", {
          pathname,
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!newRefreshToken,
        });

        // Access Token이 준비되었으므로 SSR Prefetch 진행
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set("x-access-token", accessToken);

        const successResponse = NextResponse.next({
          request: {
            headers: requestHeaders,
          },
        });

        // 새 토큰을 쿠키에 저장
        successResponse.cookies.set("access_token", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 15, // 15분
          path: "/",
        });

        successResponse.cookies.set(
          "refresh_token",
          newRefreshToken as string,
          {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7일
            path: "/",
          },
        );

        // deviceId도 쿠키에 저장
        successResponse.cookies.set("device_id", deviceId, {
          httpOnly: false, // Client에서도 읽을 수 있도록
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 365, // 1년
          path: "/",
        });

        logger.debug("Updated cookies with new tokens", { pathname });

        return successResponse;
      } catch (error) {
        logger.error("Token refresh failed in middleware", {
          pathname,
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        });

        logger.warn("Preventive refresh failed, redirecting to login", {
          pathname,
        });

        // Issue #4 해결: 무효한 토큰 삭제하여 무한 루프 방지
        const loginResponse = redirectToLogin(request);
        loginResponse.cookies.delete("access_token");
        loginResponse.cookies.delete("refresh_token");
        loginResponse.cookies.delete("user_id");
        loginResponse.cookies.delete("device_id");

        logger.debug("Deleted invalid cookies to prevent redirect loop", {
          pathname,
        });

        return loginResponse;
      }
    }

    // Access Token이 준비되었으므로 SSR Prefetch 진행
    // IMPORTANT: Cookie 스냅샷 문제로 인해 Request Headers에 Token 추가
    // Server Component는 요청 시작 시점의 Cookie만 읽으므로,
    // Middleware에서 갱신한 Token을 Headers로 전달
    //
    // Issue #3 해결: 응답 헤더가 아닌 요청 헤더에 토큰 추가
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-access-token", accessToken);

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    logger.debug("Added access token to request headers for SSR", {
      pathname,
    });

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
