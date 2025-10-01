import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/domains/auth";

/**
 * 카카오 OAuth 콜백 핸들러
 *
 * 카카오 로그인 후 리다이렉트되는 엔드포인트
 * - 프로덕션: https://nugudi.com/api/auth/callback/kakao
 * - 로컬: http://localhost:3000/api/auth/callback/kakao
 */
export async function GET(request: NextRequest) {
  try {
    return await auth.callback(request);
  } catch (error) {
    console.log("[route] Caught error:", error);

    // NEW_USER 케이스를 처리
    if (error instanceof Error) {
      console.log("[route] Error message:", error.message);
      try {
        const parsed = JSON.parse(error.message);
        console.log("[route] Parsed error:", parsed);

        if (parsed.type === "NEW_USER" && parsed.registrationToken) {
          const redirectUrl = new URL(
            "/auth/sign-up/social",
            request.nextUrl.origin,
          );
          redirectUrl.searchParams.set("token", parsed.registrationToken);
          console.log("[route] Redirecting to:", redirectUrl.toString());
          return NextResponse.redirect(redirectUrl.toString());
        }
      } catch (parseError) {
        console.log("[route] JSON parse error:", parseError);
        // JSON 파싱 실패 시 기본 에러 처리로 진행
      }
    }

    console.log("[route] Redirecting to /error");
    // 기타 에러는 에러 페이지로
    return NextResponse.redirect(new URL("/error", request.url));
  }
}
