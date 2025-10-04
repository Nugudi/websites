import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/domains/auth";
import type { Session } from "@/src/domains/auth/types";
import { handleAuthError } from "@/src/domains/auth/utils/error-handler";

/**
 * 소셜 회원가입 완료 후 세션 설정 API
 * /api/auth/sign-up/social
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, nickname, accessToken, refreshToken, deviceId, provider } =
      body;

    // 필수 필드 검증
    if (
      !userId ||
      !nickname ||
      !accessToken ||
      !refreshToken ||
      !deviceId ||
      !provider
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // 세션 생성
    const session: Session = {
      user: {
        userId,
        nickname,
      },
      tokenSet: {
        accessToken,
        refreshToken,
      },
      provider,
      deviceId,
    };

    // 세션 저장
    await auth.setSession(session);

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleAuthError(error, request);
  }
}
