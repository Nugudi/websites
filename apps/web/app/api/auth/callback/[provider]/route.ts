import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/domains/auth";
import { PROVIDERS, type ProviderType } from "@/src/domains/auth/types";
import { handleAuthError } from "@/src/domains/auth/utils/error-handler";

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
    const providerType = provider as ProviderType;

    // Provider 타입 검증
    if (!PROVIDERS.includes(providerType)) {
      return NextResponse.json(
        { error: `Invalid provider: ${providerType}` },
        { status: 400 },
      );
    }

    // credentials는 OAuth가 아니므로 제외
    if (providerType === "credentials") {
      return NextResponse.json(
        { error: "Credentials provider does not support OAuth flow" },
        { status: 400 },
      );
    }

    return auth.callback(request, providerType);
  } catch (error) {
    return handleAuthError(error, request);
  }
};

export { handler as GET, handler as POST };
