import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/domains/auth";
import { PROVIDERS, type ProviderType } from "@/src/domains/auth/types";
import { handleAuthError } from "@/src/domains/auth/utils/error-handler";

/**
 * 동적 인증 라우트 핸들러
 * /api/auth/[provider]/login
 * /api/auth/[provider]/callback
 * /api/auth/logout
 * /api/auth/session
 */
const handler = async (
  request: NextRequest,
  { params }: { params: Promise<{ auth: string[] }> },
): Promise<NextResponse> => {
  try {
    const { auth: segments } = await params;
    const [providerOrAction, action] = segments;

    // /api/auth/session - 클라이언트용 세션 조회
    if (providerOrAction === "session" && !action) {
      const session = await auth.getClientSession();
      if (!session) {
        return NextResponse.json(null, { status: 401 });
      }
      return NextResponse.json({ responseType: "SUCCESS", result: session });
    }

    // /api/auth/logout - 로그아웃
    if (providerOrAction === "logout" && !action) {
      return auth.logout(request);
    }

    // Provider 타입 검증
    const providerType = providerOrAction as ProviderType;
    if (!PROVIDERS.includes(providerType)) {
      return NextResponse.json(
        { error: `Invalid provider: ${providerType}` },
        { status: 400 },
      );
    }

    // /api/auth/[provider]/login - OAuth 로그인 시작
    if (action === "login") {
      return auth.authorize(request, providerType);
    }

    // /api/auth/[provider]/callback - OAuth 콜백 처리
    if (action === "callback") {
      return auth.callback(request, providerType);
    }

    // 잘못된 경로
    return NextResponse.redirect(new URL("/404", request.url));
  } catch (error) {
    console.log(error);
    return handleAuthError(error, request);
  }
};

export { handler as GET, handler as POST };
