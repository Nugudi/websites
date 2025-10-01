import { getKakaoAuthorizeUrl, kakaoLogin } from "@nugudi/api";
import type { NextRequest } from "next/server";
import { AuthClient } from "@/src/domains/auth/utils/auth-client";

export const auth = new AuthClient({
  secret: process.env.INTERNAL_AUTH_SECRET as string,
  sessionCookieName: "nugudi.session",
  cookieOptions: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
  authorize: async (_request: NextRequest) => {
    try {
      // NUGUDI API: GET /api/v1/auth/login/kakao/authorize-url
      // 매개변수 없음 (baseUrl은 서버에서 관리)
      const response = await getKakaoAuthorizeUrl(
        {
          redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/kakao`,
        },
        { next: { revalidate: 60 * 60 } }, // 1 hour
      );

      console.log("[authorize] Response:", {
        status: response.status,
        data: response.data,
      });

      // NUGUDI 응답 구조: response.data.data.authorizeUrl
      const authorizeUrl = response.data.data?.authorizeUrl;
      if (!authorizeUrl) {
        console.error("[authorize] No authorizeUrl in response");
        return null;
      }

      console.log("[authorize] Success:", authorizeUrl);
      return authorizeUrl;
    } catch (error) {
      console.error("[authorize] Error:", error);
      return null;
    }
  },
  callback: async (request: NextRequest) => {
    try {
      const code = request.nextUrl.searchParams.get("code");
      console.log("[callback] Received code:", code ? "✓" : "✗");

      if (!code) {
        console.error("[callback] No authorization code");
        return null;
      }

      const deviceId =
        request.headers.get("x-device-id") || `web-${crypto.randomUUID()}`;

      console.log("[callback] Calling kakaoLogin with deviceId:", deviceId);

      // NUGUDI API: POST /api/v1/auth/login/kakao
      const response = await kakaoLogin({
        code,
        redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/kakao`,
        deviceInfo: {
          deviceType: "WEB",
          deviceUniqueId: deviceId,
          deviceName: request.headers.get("user-agent") || "Unknown",
        },
      });

      console.log("[callback] Response:", {
        status: response.status,
        data: response.data,
      });

      // NUGUDI 응답 구조: response.data.data
      const data = response.data.data;

      if (!data) {
        console.error("[callback] No data in response");
        return null;
      }

      // 신규 회원 (status: "NEW_USER") - registrationToken 반환
      // null을 반환하면 callback 함수가 에러 페이지로 리다이렉트함
      // 대신 API 라우트 핸들러에서 직접 처리하도록 예외를 던짐
      if (data.status === "NEW_USER" && data.registrationToken) {
        console.log("[callback] New user - registration required", {
          registrationToken: data.registrationToken,
        });

        throw new Error(
          JSON.stringify({
            type: "NEW_USER",
            registrationToken: data.registrationToken,
          }),
        );
      }

      // 기존 회원 (status: "EXISTING_USER") - 세션 생성
      if (
        data.status === "EXISTING_USER" &&
        data.userId &&
        data.nickname &&
        data.accessToken &&
        data.refreshToken
      ) {
        console.log("[callback] Existing user - creating session", {
          userId: data.userId,
          nickname: data.nickname,
        });

        return {
          user: {
            userId: data.userId,
            nickname: data.nickname,
            profileImageUrl: data.profileImageUrl,
          },
          tokenSet: {
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            accessTokenExpiresAt: data.accessTokenExpiresAt,
            refreshTokenExpiresAt: data.refreshTokenExpiresAt,
          },
          deviceId,
        };
      }

      console.error("[callback] Unexpected response", { data });
      return null;
    } catch (error) {
      console.error("[callback] Error:", error);
      // NEW_USER 에러는 route handler에서 처리할 수 있도록 다시 throw
      throw error;
    }
  },
});
