import { type NextRequest, NextResponse } from "next/server";
import { handleAuthError } from "@/src/domains/auth/data/utils/error-handler";
import { createAuthServerContainer } from "@/src/domains/auth/di/auth-server-container";

/**
 * 소셜 회원가입 완료 후 세션 설정 API
 * /api/auth/sign-up/social
 *
 * Note: 이 API는 회원가입 완료 후 세션을 설정하는데 사용되나,
 * 실제로는 signUpWithSocial 서버 액션에서 이미 세션이 저장되므로
 * 이 엔드포인트는 레거시 호환성을 위해 유지됨
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, nickname, accessToken, refreshToken } = body;

    // 필수 필드 검증
    if (!userId || !nickname || !accessToken || !refreshToken) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const container = createAuthServerContainer();
    const sessionManager = container.getSessionManager();

    // 세션 저장 (Token + userId)
    await sessionManager.saveSession({
      accessToken,
      refreshToken,
      userId,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleAuthError(error, request);
  }
}
