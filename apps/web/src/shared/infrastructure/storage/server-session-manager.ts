/**
 * Server Session Manager
 *
 * 서버 환경에서 사용하는 Session Manager 구현
 * - Cookie를 사용한 토큰 저장 (HttpOnly, Secure)
 * - Next.js cookies API 사용
 */

import { cookies } from "next/headers";
import type { SessionData, SessionManager } from "./session-manager";

const ACCESS_TOKEN_COOKIE = "access_token";
const REFRESH_TOKEN_COOKIE = "refresh_token";
const USER_ID_COOKIE = "user_id";
const NICKNAME_COOKIE = "nickname";
const DEVICE_ID_COOKIE = "device_id";

/**
 * Server Session Manager Implementation
 *
 * Next.js cookies API를 사용하여 세션 데이터를 관리합니다.
 * - HttpOnly 쿠키로 XSS 공격 방지
 * - Secure 쿠키로 HTTPS에서만 전송
 * - SameSite=Lax로 CSRF 공격 방지
 */
export class ServerSessionManager implements SessionManager {
  /**
   * 세션 저장
   */
  async saveSession(data: SessionData): Promise<void> {
    const cookieStore = await cookies();

    // Access Token (HttpOnly)
    cookieStore.set(ACCESS_TOKEN_COOKIE, data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 15, // 15분
      path: "/",
    });

    // Refresh Token (HttpOnly)
    cookieStore.set(REFRESH_TOKEN_COOKIE, data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7일
      path: "/",
    });

    // User ID (선택적, Client에서 읽을 수 있음)
    if (data.userId !== undefined) {
      cookieStore.set(USER_ID_COOKIE, String(data.userId), {
        httpOnly: false, // Client에서 읽을 수 있도록
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7일
        path: "/",
      });
    }

    // Nickname (선택적, Client에서 읽을 수 있음)
    if (data.nickname) {
      cookieStore.set(NICKNAME_COOKIE, data.nickname, {
        httpOnly: false, // Client에서 읽을 수 있도록
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7일
        path: "/",
      });
    }
  }

  /**
   * 세션 조회
   */
  async getSession(): Promise<SessionData | null> {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
    const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

    if (!accessToken || !refreshToken) {
      return null;
    }

    const userIdStr = cookieStore.get(USER_ID_COOKIE)?.value;
    const nickname = cookieStore.get(NICKNAME_COOKIE)?.value;

    return {
      accessToken,
      refreshToken,
      userId: userIdStr ? Number(userIdStr) : undefined,
      nickname: nickname ?? undefined,
    };
  }

  /**
   * 세션 삭제
   */
  async clearSession(): Promise<void> {
    const cookieStore = await cookies();

    cookieStore.delete(ACCESS_TOKEN_COOKIE);
    cookieStore.delete(REFRESH_TOKEN_COOKIE);
    cookieStore.delete(USER_ID_COOKIE);
    cookieStore.delete(NICKNAME_COOKIE);
  }

  /**
   * 디바이스 ID 조회 (쿠키에서)
   */
  async getDeviceId(): Promise<string> {
    const cookieStore = await cookies();

    let deviceId = cookieStore.get(DEVICE_ID_COOKIE)?.value;

    if (!deviceId) {
      deviceId = this.generateDeviceId();
      cookieStore.set(DEVICE_ID_COOKIE, deviceId, {
        httpOnly: false, // Client에서도 읽을 수 있도록
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365, // 1년
        path: "/",
      });
    }

    return deviceId;
  }

  /**
   * Access Token 조회
   */
  async getAccessToken(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value ?? null;
  }

  /**
   * Refresh Token 조회
   */
  async getRefreshToken(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get(REFRESH_TOKEN_COOKIE)?.value ?? null;
  }

  /**
   * UUID v4 형식의 디바이스 ID 생성
   */
  private generateDeviceId(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
