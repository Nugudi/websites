import { type NextRequest, NextResponse } from "next/server";
import { handleAuthError } from "@/src/domains/auth/data/utils/error-handler";
import { state } from "@/src/domains/auth/data/utils/url";
import { createAuthServerContainer } from "@/src/domains/auth/di/auth-server-container";

type OAuthProvider = "google" | "kakao" | "naver";
const OAUTH_PROVIDERS: OAuthProvider[] = ["google", "kakao", "naver"];

/**
 * 동적 인증 라우트 핸들러
 * /api/auth/[provider]/login
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

    const container = createAuthServerContainer();

    // /api/auth/session - 클라이언트용 세션 조회
    if (providerOrAction === "session" && !action) {
      const getCurrentSessionUseCase = container.getCurrentSession();
      const session = await getCurrentSessionUseCase.execute();
      if (!session) {
        return NextResponse.json(null, { status: 401 });
      }
      return NextResponse.json({ responseType: "SUCCESS", result: session });
    }

    // /api/auth/logout - 로그아웃
    if (providerOrAction === "logout" && !action) {
      const logoutUseCase = container.getLogout();
      await logoutUseCase.execute();
      const to = request.nextUrl.searchParams.get("to") || "/";
      return NextResponse.redirect(new URL(to, request.url));
    }

    // Provider 타입 검증
    const providerType = providerOrAction as OAuthProvider;
    if (!OAUTH_PROVIDERS.includes(providerType)) {
      return NextResponse.json(
        { error: `Invalid provider: ${providerType}` },
        { status: 400 },
      );
    }

    // /api/auth/[provider]/login - OAuth 로그인 시작
    if (action === "login") {
      const to = request.nextUrl.searchParams.get("to") || "/";
      const baseUrl = new URL(request.url).origin;
      const redirectUri = new URL(
        `/api/auth/callback/${providerType}`,
        baseUrl,
      ).toString();

      const getOAuthAuthorizeUrlUseCase = container.getOAuthAuthorizeUrl();
      const authorizeUrl = await getOAuthAuthorizeUrlUseCase.execute(
        providerType,
        redirectUri,
      );

      const authorizeUrlWithState = new URL(authorizeUrl);
      authorizeUrlWithState.searchParams.set("state", state.encode({ to }));

      return NextResponse.redirect(authorizeUrlWithState.toString());
    }

    // 잘못된 경로
    return NextResponse.redirect(new URL("/404", request.url));
  } catch (error) {
    return handleAuthError(error, request);
  }
};

export { handler as GET, handler as POST };
