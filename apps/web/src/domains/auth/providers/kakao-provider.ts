import { getKakaoAuthorizeUrl, kakaoLogin } from "@nugudi/api";
import { UAParser } from "ua-parser-js";
import type {
  ExchangeTokenParams,
  GetAuthorizeUrlParams,
  OAuthProvider,
  Session,
} from "../types";
import { AuthError } from "../types/errors";

export class KakaoProvider implements OAuthProvider {
  readonly type = "kakao" as const;

  async getAuthorizeUrl({
    redirectUri,
  }: GetAuthorizeUrlParams): Promise<string> {
    try {
      const response = await getKakaoAuthorizeUrl({
        redirectUri,
      });

      if (response.status !== 200 || !response.data.success) {
        throw AuthError.authorizationFailed(
          "kakao",
          "Failed to get authorize URL",
        );
      }

      const authorizeUrl = response.data.data?.authorizeUrl;
      if (!authorizeUrl) {
        throw AuthError.authorizationFailed("kakao", "No authorize URL found");
      }

      return authorizeUrl;
    } catch (error) {
      if (error instanceof AuthError) throw error;
      throw AuthError.authorizationFailed("kakao", String(error));
    }
  }

  /**
   * 카카오 OAuth 토큰 교환 및 세션 생성
   */
  async exchangeToken({
    request,
    redirectUri,
  }: ExchangeTokenParams): Promise<Session> {
    try {
      const code = request.nextUrl.searchParams.get("code");
      if (!code) {
        throw AuthError.invalidCallbackCode("kakao");
      }

      // 클라이언트에서 전달된 deviceInfo 읽기 (헤더 또는 쿠키)
      const deviceUniqueId =
        request.headers.get("x-device-id") ||
        request.cookies.get("deviceId")?.value ||
        crypto.randomUUID();

      const userAgent = request.headers.get("user-agent") || "Unknown";

      const deviceInfo = this.parseDeviceInfo(userAgent, deviceUniqueId);

      const response = await kakaoLogin({
        code,
        redirectUri,
        deviceInfo,
      });

      // 신규 회원 (202 ACCEPTED)
      if (response.data.data?.status === "NEW_USER") {
        const data = response.data.data;
        if (!data?.registrationToken) {
          throw AuthError.tokenExchangeFailed(
            "kakao",
            "No registration token in response",
          );
        }

        // 신규 회원 에러를 던져서 상위에서 회원가입 페이지로 리다이렉트 처리
        throw AuthError.newUserSignupRequired("kakao", data.registrationToken);
      }

      // 기존 회원 (200 OK)
      if (response.status !== 200 || !response.data.success) {
        throw AuthError.tokenExchangeFailed("kakao", "Token exchange failed");
      }

      const data = response.data.data;
      if (!data) {
        throw AuthError.tokenExchangeFailed("kakao", "No data in response");
      }

      // 기존 회원 데이터 검증
      if (
        typeof data.userId !== "number" ||
        typeof data.nickname !== "string" ||
        typeof data.accessToken !== "string" ||
        typeof data.refreshToken !== "string"
      ) {
        throw AuthError.tokenExchangeFailed(
          "kakao",
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
        provider: "kakao",
      };
    } catch (error) {
      if (error instanceof AuthError) throw error;
      throw AuthError.tokenExchangeFailed("kakao", String(error));
    }
  }

  /**
   * User-Agent에서 디바이스 정보 추출 (ua-parser-js 사용)
   */
  private parseDeviceInfo(
    userAgent: string,
    deviceUniqueId: string,
  ): {
    deviceType: "IOS" | "ANDROID" | "WEB";
    deviceUniqueId: string;
    deviceName: string;
    deviceModel: string;
    osVersion: string;
  } {
    const parser = new UAParser(userAgent);
    const device = parser.getDevice();
    const os = parser.getOS();
    const browser = parser.getBrowser();

    // 디바이스 타입 결정
    let deviceType: "IOS" | "ANDROID" | "WEB" = "WEB";
    if (os.name === "iOS") {
      deviceType = "IOS";
    } else if (os.name === "Android") {
      deviceType = "ANDROID";
    }

    // 디바이스 이름 결정
    let deviceName = "Web Browser";
    if (device.model) {
      deviceName = device.model;
    } else if (device.vendor) {
      deviceName = device.vendor;
    } else if (os.name) {
      deviceName = `${os.name} Device`;
    }

    return {
      deviceType,
      deviceUniqueId,
      deviceName,
      deviceModel: browser.name || "Unknown",
      osVersion: os.version || "Unknown",
    };
  }
}
