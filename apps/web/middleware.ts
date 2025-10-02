import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@/src/domains/auth";
import { isTokenExpired } from "@/src/domains/auth/utils/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 인증이 필요 없는 경로들
  const publicPaths = ["/auth", "/api/auth"];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  if (isPublicPath) {
    return NextResponse.next();
  }

  // 세션 유효성 체크 (refresh하지 않음 - 읽기만)
  const session = await auth.getSession({ refresh: false });

  if (!session) {
    // 세션이 없으면 쿠키 삭제 후 통과
    const response = NextResponse.next();
    response.cookies.delete("nugudi.session");
    return response;
  }

  // Access Token 만료 체크
  if (isTokenExpired(session.tokenSet.accessToken)) {
    console.log("[Middleware] Access token expired, attempting refresh...");

    // 토큰 갱신 시도
    const encryptedSession = await auth.refreshAndGetEncryptedSession(session);

    if (encryptedSession) {
      console.log(
        "[Middleware] Token refresh successful, updating session cookie",
      );
      // 갱신 성공 - 새 쿠키 설정
      const response = NextResponse.next();
      response.cookies.set("nugudi.session", encryptedSession, {
        httpOnly: true,
        sameSite: "lax",
        secure: true,
        maxAge: 60 * 60 * 24 * 7, // 7일
      });
      return response;
    }

    console.log("[Middleware] Token refresh failed, deleting session cookie");
    // 갱신 실패 - 쿠키 삭제
    const response = NextResponse.next();
    response.cookies.delete("nugudi.session");
    return response;
  }

  // 유효한 세션이 있으면 통과
  return NextResponse.next();
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
