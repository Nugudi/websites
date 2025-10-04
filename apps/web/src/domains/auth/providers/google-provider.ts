import { getGoogleAuthorizeUrl, googleLogin } from "@nugudi/api";
import type {
  ExchangeTokenParams,
  GetAuthorizeUrlParams,
  OAuthProvider,
  Session,
} from "../types";
import { AuthError } from "../types/errors";
import { createDeviceInfo } from "../utils/device";

export class GoogleProvider implements OAuthProvider {
  readonly type = "google" as const;

  async getAuthorizeUrl({
    redirectUri,
  }: GetAuthorizeUrlParams): Promise<string> {
    try {
      const response = await getGoogleAuthorizeUrl({
        redirectUri,
      });

      if (response.status !== 200 || !response.data.success) {
        throw AuthError.authorizationFailed(
          "google",
          "Failed to get authorize URL",
        );
      }

      const authorizeUrl = response.data.data?.authorizeUrl;
      if (!authorizeUrl) {
        throw AuthError.authorizationFailed("google", "No authorize URL found");
      }

      return authorizeUrl;
    } catch (error) {
      if (error instanceof AuthError) throw error;
      throw AuthError.authorizationFailed("google", String(error));
    }
  }

  /**
   * 구글 OAuth 토큰 교환 및 세션 생성
   */
  async exchangeToken({
    request,
    redirectUri,
  }: ExchangeTokenParams): Promise<Session> {
    try {
      const code = request.nextUrl.searchParams.get("code");
      if (!code) {
        throw AuthError.invalidCallbackCode("google");
      }

      const userAgent = request.headers.get("user-agent") || "Unknown";
      const deviceInfo = createDeviceInfo(userAgent);
      const deviceId = deviceInfo.deviceUniqueId;

      const response = await googleLogin({
        code,
        redirectUri,
        deviceInfo,
      });

      // 신규 회원 (202 ACCEPTED)
      if (response.data.data?.status === "NEW_USER") {
        const data = response.data.data;
        if (!data?.registrationToken) {
          throw AuthError.tokenExchangeFailed(
            "google",
            "No registration token in response",
          );
        }

        // 신규 회원 에러를 던져서 상위에서 회원가입 페이지로 리다이렉트 처리
        throw AuthError.newUserSignupRequired("google", data.registrationToken);
      }

      // 기존 회원 (200 OK)
      if (response.status !== 200 || !response.data.success) {
        throw AuthError.tokenExchangeFailed("google", "Token exchange failed");
      }

      const data = response.data.data;
      if (!data) {
        throw AuthError.tokenExchangeFailed("google", "No data in response");
      }

      // 기존 회원 데이터 검증
      if (
        typeof data.userId !== "number" ||
        typeof data.nickname !== "string" ||
        typeof data.accessToken !== "string" ||
        typeof data.refreshToken !== "string"
      ) {
        throw AuthError.tokenExchangeFailed(
          "google",
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
        provider: "google",
        deviceId,
      };
    } catch (error) {
      if (error instanceof AuthError) throw error;
      throw AuthError.tokenExchangeFailed("google", String(error));
    }
  }
}
