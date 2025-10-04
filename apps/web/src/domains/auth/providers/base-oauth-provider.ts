import type {
  ExchangeTokenParams,
  GetAuthorizeUrlParams,
  OAuthProvider,
  ProviderType,
  Session,
} from "../types";
import { AuthError } from "../types/errors";
import { createDeviceInfo } from "../utils/device";

/**
 * OAuth Provider의 공통 로직을 담은 추상 클래스
 */
export abstract class BaseOAuthProvider implements OAuthProvider {
  abstract readonly type: Exclude<ProviderType, "credentials">;

  /**
   * 각 Provider의 고유한 인증 URL 요청 API
   */
  protected abstract fetchAuthorizeUrl(redirectUri: string): Promise<{
    status: number;
    data: { success?: boolean; data?: { authorizeUrl?: string } };
  }>;

  /**
   * 각 Provider의 고유한 로그인 API
   */
  protected abstract fetchLogin(params: {
    code: string;
    redirectUri: string;
    deviceInfo: ReturnType<typeof createDeviceInfo>;
  }): Promise<{
    status: number;
    data: {
      success?: boolean;
      data?: {
        status?: "NEW_USER" | "EXISTING_USER";
        registrationToken?: string;
        userId?: number;
        nickname?: string;
        accessToken?: string;
        refreshToken?: string;
      };
    };
  }>;

  /**
   * OAuth 인증 URL 생성 (공통 로직)
   */
  async getAuthorizeUrl({
    redirectUri,
  }: GetAuthorizeUrlParams): Promise<string> {
    try {
      const response = await this.fetchAuthorizeUrl(redirectUri);

      if (response.status !== 200 || !response.data.success) {
        throw AuthError.authorizationFailed(
          this.type,
          "Failed to get authorize URL",
        );
      }

      const authorizeUrl = response.data.data?.authorizeUrl;
      if (!authorizeUrl) {
        throw AuthError.authorizationFailed(
          this.type,
          "No authorize URL found",
        );
      }

      return authorizeUrl;
    } catch (error) {
      if (error instanceof AuthError) throw error;
      throw AuthError.authorizationFailed(this.type, String(error));
    }
  }

  /**
   * OAuth 토큰 교환 및 세션 생성 (공통 로직)
   */
  async exchangeToken({
    request,
    redirectUri,
  }: ExchangeTokenParams): Promise<Session> {
    try {
      const code = request.nextUrl.searchParams.get("code");
      if (!code) {
        throw AuthError.invalidCallbackCode(this.type);
      }

      const userAgent = request.headers.get("user-agent") || "Unknown";
      const deviceInfo = createDeviceInfo(userAgent, request);
      const deviceId = deviceInfo.deviceUniqueId;

      const response = await this.fetchLogin({
        code,
        redirectUri,
        deviceInfo,
      });

      // 신규 회원 (202 ACCEPTED)
      if (response.data.data?.status === "NEW_USER") {
        const data = response.data.data;
        if (!data?.registrationToken) {
          throw AuthError.tokenExchangeFailed(
            this.type,
            "No registration token in response",
          );
        }

        // 신규 회원 에러를 던져서 상위에서 회원가입 페이지로 리다이렉트 처리
        throw AuthError.newUserSignupRequired(
          this.type,
          data.registrationToken,
        );
      }

      // 기존 회원 (200 OK)
      if (response.status !== 200 || !response.data.success) {
        throw AuthError.tokenExchangeFailed(this.type, "Token exchange failed");
      }

      const data = response.data.data;
      if (!data) {
        throw AuthError.tokenExchangeFailed(this.type, "No data in response");
      }

      // 기존 회원 데이터 검증
      if (
        typeof data.userId !== "number" ||
        typeof data.nickname !== "string" ||
        typeof data.accessToken !== "string" ||
        typeof data.refreshToken !== "string"
      ) {
        throw AuthError.tokenExchangeFailed(
          this.type,
          "Invalid response data types",
        );
      }

      return {
        user: {
          userId: data.userId,
          nickname: data.nickname,
        },
        tokenSet: {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        },
        provider: this.type,
        deviceId,
      };
    } catch (error) {
      if (error instanceof AuthError) throw error;
      throw AuthError.tokenExchangeFailed(this.type, String(error));
    }
  }
}
