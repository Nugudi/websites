import { type NextRequest, NextResponse } from "next/server";
import { createAuthServerContainer } from "@/src/di/auth-server-container";
import { handleAuthError } from "@/src/domains/auth/utils/error-handler";
import { state } from "@/src/domains/auth/utils/url";
import { logger } from "@/src/shared/infrastructure/logging/logger";

type OAuthProvider = "google" | "kakao" | "naver";
const OAUTH_PROVIDERS: OAuthProvider[] = ["google", "kakao", "naver"];

/**
 * OAuth 콜백 처리 라우트
 * /api/auth/callback/[provider]
 */
const handler = async (
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> },
): Promise<NextResponse> => {
  try {
    const { provider } = await params;
    const providerType = provider as OAuthProvider;

    logger.info("OAuth callback started", {
      provider: providerType,
      url: request.url,
    });

    // Provider 타입 검증
    if (!OAUTH_PROVIDERS.includes(providerType)) {
      logger.error("Invalid provider", { provider: providerType });
      return NextResponse.json(
        { error: `Invalid provider: ${providerType}` },
        { status: 400 },
      );
    }

    const code = request.nextUrl.searchParams.get("code");
    if (!code) {
      logger.error("Missing authorization code");
      return NextResponse.json(
        { error: "Missing authorization code" },
        { status: 400 },
      );
    }

    const baseUrl = new URL(request.url).origin;
    const redirectUri = new URL(
      `/api/auth/callback/${providerType}`,
      baseUrl,
    ).toString();

    logger.info("Attempting OAuth login", {
      provider: providerType,
      redirectUri,
    });

    const container = createAuthServerContainer();
    const authService = container.getAuthService();

    const result = await authService.loginWithOAuth(
      providerType,
      code,
      redirectUri,
    );

    logger.info("OAuth login result", {
      type: result.type,
      provider: providerType,
    });

    // 기존 회원 - 메인 페이지로 리다이렉트
    if (result.type === "EXISTING_USER") {
      const encoded = request.nextUrl.searchParams.get("state");
      const targetUrl = encoded
        ? new URL(state.decode<{ to: string }>(encoded).to, request.url)
        : new URL("/", request.url);

      logger.info("Redirecting existing user", {
        userId: result.userId,
        nickname: result.nickname,
        targetUrl: targetUrl.toString(),
      });

      return NextResponse.redirect(targetUrl);
    }

    // 신규 회원 - 회원가입 페이지로 리다이렉트
    if (result.type === "NEW_USER") {
      const signupUrl = new URL("/auth/sign-up/social", request.url);
      signupUrl.searchParams.set("provider", providerType);
      signupUrl.searchParams.set("token", result.registrationToken);

      logger.info("Redirecting new user to signup", {
        signupUrl: signupUrl.toString(),
      });

      return NextResponse.redirect(signupUrl.toString());
    }

    logger.error("Unknown response type from OAuth login");
    return NextResponse.json(
      { error: "Unknown response type" },
      { status: 500 },
    );
  } catch (error) {
    logger.error("OAuth callback error", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return handleAuthError(error, request);
  }
};

export { handler as GET, handler as POST };
