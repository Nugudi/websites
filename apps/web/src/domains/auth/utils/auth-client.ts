import { logout as logoutAPI, refreshToken } from "@nugudi/api";
import * as jose from "jose";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { logger } from "@/src/lib/logger";
import { AuthError } from "../errors/auth-error";
import { providerRegistry } from "../providers/provider-registry";
import {
  type ClientSession,
  type CookieOptions,
  isOAuthProvider,
  type ProviderType,
  type Session,
  toClientSession,
} from "../types";
import { handleAuthError } from "./error-handler";
import { isTokenExpired } from "./jwt";
import { state } from "./url";

export interface AuthClientConfig {
  secret: string;
  sessionCookieName: string;
  cookieOptions: CookieOptions;
}

export class AuthClient {
  private readonly config: AuthClientConfig;

  constructor(config: AuthClientConfig) {
    this.config = config;
  }

  /**
   * OAuth 인증 시작
   * @params request Next.js request
   * @params providerType Provider 타입
   */
  public async authorize(request: NextRequest, providerType: ProviderType) {
    const to = request.nextUrl.searchParams.get("to") || "/";

    try {
      const provider = providerRegistry.getProvider(providerType);

      if (!isOAuthProvider(provider)) {
        throw AuthError.invalidProvider(providerType);
      }

      const baseUrl = new URL(request.url).origin;
      const redirectUri = new URL(
        `/api/auth/callback/${providerType}`,
        baseUrl,
      ).toString();

      const authorizeUrl = await provider.getAuthorizeUrl({
        request,
        redirectUri,
      });

      const authorizeUrlWithState = new URL(authorizeUrl);
      authorizeUrlWithState.searchParams.set("state", state.encode({ to }));

      return NextResponse.redirect(authorizeUrlWithState.toString());
    } catch (error) {
      return handleAuthError(error, request);
    }
  }

  /**
   * OAuth 콜백 처리
   * @param request Next.js request
   * @param providerType Provider 타입
   */
  public async callback(request: NextRequest, providerType: ProviderType) {
    try {
      const provider = providerRegistry.getProvider(providerType);

      if (!isOAuthProvider(provider)) {
        throw AuthError.invalidProvider(providerType);
      }

      const redirectUri = new URL(
        `/api/auth/callback/${providerType}`,
        request.url,
      ).toString();

      const session = await provider.exchangeToken({
        request,
        redirectUri,
      });

      await this.setSession(session);

      const encoded = request.nextUrl.searchParams.get("state");
      if (encoded) {
        const { to } = state.decode<{ to: string }>(encoded);
        return NextResponse.redirect(new URL(to, request.url));
      }

      return NextResponse.redirect(new URL("/", request.url));
    } catch (error) {
      // 신규 회원인 경우 회원가입 페이지로 리다이렉트
      if (
        error instanceof AuthError &&
        error.code === "NEW_USER_SIGNUP_REQUIRED"
      ) {
        const registrationToken = error.context?.registrationToken as string;
        const signupUrl = new URL("/auth/sign-up/social", request.url);
        signupUrl.searchParams.set("provider", providerType);
        signupUrl.searchParams.set("token", registrationToken);

        return NextResponse.redirect(signupUrl.toString());
      }

      return handleAuthError(error, request);
    }
  }

  /**
   * 로그아웃
   */
  public async logout(request: NextRequest) {
    const session = await this.getSession({ refresh: false });

    // 서버에 로그아웃 알림 (Refresh Token 무효화)
    if (session) {
      try {
        await logoutAPI({
          headers: {
            Authorization: `Bearer ${session.tokenSet.refreshToken}`,
            "X-Device-ID": session.deviceId,
          },
        });
      } catch (error) {
        // 서버 로그아웃 실패해도 클라이언트 쿠키는 삭제
        logger.error("Server logout failed", {
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    // 클라이언트 쿠키 삭제
    const cookieStore = await cookies();
    cookieStore.delete({
      name: this.config.sessionCookieName,
      ...this.config.cookieOptions,
    });

    const to = request.nextUrl.searchParams.get("to") || "/";
    return NextResponse.redirect(new URL(to, request.url));
  }

  /**
   * 세션 저장
   */
  public async setSession(session: Session) {
    const cookieStore = await cookies();
    const encrypted = await this.encrypt(session);

    cookieStore.set(
      this.config.sessionCookieName,
      encrypted,
      this.config.cookieOptions,
    );

    // Device ID를 별도 쿠키로 저장하여 재사용 가능하도록 함
    if (session.deviceId) {
      cookieStore.set("x-device-id", session.deviceId, {
        ...this.config.cookieOptions,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
    }
  }

  /**
   * 세션 조회 (서버 전용)
   *
   * IMPORTANT: 기본적으로 토큰 만료 체크는 Middleware에서 수행하므로 여기서는 체크하지 않음
   * - 단, options.refresh가 true로 명시된 경우에는 만료 체크 및 자동 갱신을 수행함
   * - Middleware: 모든 요청에 대해 토큰 만료 체크 + 자동 갱신
   * - Server Component: 갱신된 세션을 단순 조회만 수행 (refresh: false 권장)
   *
   * @param options.refresh - 토큰 자동 갱신 여부 (기본값: false, Middleware가 이미 처리함, true일 경우 만료 체크 및 갱신 수행)
   */
  public async getSession(
    options: { refresh?: boolean } = { refresh: false },
  ): Promise<Session | null> {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(this.config.sessionCookieName);

    if (!cookie?.value) {
      return null;
    }

    const session = (await this.decrypt(cookie.value)) as Session | null;

    if (!session) {
      return null;
    }

    // refresh 옵션이 false면 토큰 갱신 없이 반환 (기본 동작)
    if (!options.refresh) {
      return session;
    }

    // refresh: true가 명시적으로 전달된 경우에만 갱신 수행
    // (API Route 등 Middleware를 거치지 않는 특수한 경우에만 사용)
    if (isTokenExpired(session.tokenSet.accessToken)) {
      const refreshed = await this.refreshSession(session);
      if (!refreshed) {
        // Server Component에서는 쿠키를 삭제할 수 없음 (Next.js 15 제약)
        // 만료된 세션은 null 반환만 하고, 실제 쿠키 삭제는 middleware에서 처리
        return null;
      }
      return refreshed;
    }

    return session;
  }

  /**
   * 클라이언트용 세션 조회 (refresh token 제외)
   * Middleware에서 이미 토큰 갱신을 처리하므로 refresh: false
   */
  public async getClientSession(): Promise<ClientSession | null> {
    const session = await this.getSession({ refresh: false });
    if (!session) {
      return null;
    }
    return toClientSession(session);
  }

  /**
   * Middleware에서 사용: 토큰 갱신 후 암호화된 세션 반환
   * Response 객체를 통해 쿠키를 설정할 수 있도록 암호화된 세션 문자열 반환
   */
  public async refreshAndGetEncryptedSession(
    session: Session,
  ): Promise<string | null> {
    try {
      const refreshedSession = await this.callRefreshTokenAPI(session);
      if (!refreshedSession) {
        return null;
      }

      return this.encrypt(refreshedSession);
    } catch (error) {
      logger.error("Token refresh failed in middleware", {
        error: error instanceof Error ? error.message : String(error),
      });
      return null;
    }
  }

  /**
   * 토큰 갱신 (Server Component용)
   */
  private async refreshSession(session: Session): Promise<Session | null> {
    try {
      const refreshedSession = await this.callRefreshTokenAPI(session);
      if (!refreshedSession) {
        return null;
      }

      await this.setSession(refreshedSession);
      return refreshedSession;
    } catch (error) {
      logger.error("Token refresh failed", {
        error: error instanceof Error ? error.message : String(error),
      });
      return null;
    }
  }

  /**
   * 토큰 갱신 API 호출 (공통 로직)
   */
  private async callRefreshTokenAPI(session: Session): Promise<Session | null> {
    const response = await refreshToken({
      headers: {
        Authorization: `Bearer ${session.tokenSet.refreshToken}`,
        "X-Device-ID": session.deviceId,
      },
    });

    if (
      response.status === 200 &&
      response.data.data?.accessToken &&
      response.data.data?.refreshToken
    ) {
      return {
        ...session,
        tokenSet: {
          accessToken: response.data.data.accessToken,
          refreshToken: response.data.data.refreshToken,
        },
      };
    }

    return null;
  }

  /**
   * 세션 암호화 키
   */
  private get secret(): Uint8Array {
    const bytes = new Uint8Array(Buffer.from(this.config.secret, "base64"));
    if (bytes.length !== 32) {
      throw AuthError.invalidSessionData(
        `Invalid secret key length: ${bytes.length} bytes (expected 32 bytes for A256GCM)`,
      );
    }

    return bytes;
  }

  /**
   * 세션 암호화
   */
  private async encrypt(session: Session): Promise<string> {
    try {
      return new jose.EncryptJWT(session as unknown as jose.JWTPayload)
        .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .encrypt(this.secret);
    } catch (error) {
      logger.error("Session encryption failed", {
        error: error instanceof Error ? error.message : String(error),
      });
      throw AuthError.invalidSessionData("Failed to encrypt session data");
    }
  }

  /**
   * 세션 복호화
   */
  private async decrypt(jwe: string): Promise<Session | null> {
    try {
      const { payload } = await jose.jwtDecrypt<Session>(jwe, this.secret);
      return payload;
    } catch {
      return null;
    }
  }
}
