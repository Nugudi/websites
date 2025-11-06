/**
 * Server Session Manager
 *
 * 서버 환경에서 사용하는 Session Manager 구현
 * - Cookie를 사용한 토큰 저장 (HttpOnly, Secure)
 * - Next.js cookies API 사용
 * - Middleware에서 갱신한 Token을 Headers로 전달받아 우선 사용
 */

import "server-only";

import { cookies, headers } from "next/headers";
import type { SessionData, SessionManager } from "./session-manager";

const ACCESS_TOKEN_COOKIE = "access_token";
const REFRESH_TOKEN_COOKIE = "refresh_token";
const USER_ID_COOKIE = "user_id";
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

    // User ID (HttpOnly)
    if (data.userId !== undefined) {
      cookieStore.set(USER_ID_COOKIE, String(data.userId), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7일
        path: "/",
      });
    }
  }

  /**
   * 세션 조회
   *
   * Token 조회 우선순위:
   * 1. Request Headers의 x-access-token (Middleware에서 갱신한 Token)
   * 2. Cookie의 access_token (기존 Token)
   *
   * Why Headers Priority?
   * - Middleware에서 Token을 갱신해도 Server Component는 Cookie 스냅샷만 읽음
   * - Middleware가 갱신한 Token을 Headers로 전달하여 SSR Prefetch가 최신 Token 사용
   */
  async getSession(): Promise<SessionData | null> {
    const cookieStore = await cookies();
    const headersList = await headers();

    // 1. Request Headers에서 Access Token 조회 (Middleware에서 갱신한 Token)
    let accessToken = headersList.get("x-access-token");

    // 2. Cookie에서 Access Token 조회 (Fallback)
    if (!accessToken) {
      accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value ?? null;
    }

    const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;
    const userId = cookieStore.get(USER_ID_COOKIE)?.value;

    if (!accessToken || !refreshToken || !userId) {
      return null;
    }

    return {
      accessToken,
      refreshToken,
      userId,
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
   *
   * 조회 우선순위:
   * 1. Request Headers의 x-access-token (Middleware에서 갱신한 Token)
   * 2. Cookie의 access_token (기존 Token)
   */
  async getAccessToken(): Promise<string | null> {
    const headersList = await headers();
    const cookieStore = await cookies();

    // 1. Request Headers 우선 조회
    const tokenFromHeader = headersList.get("x-access-token");
    if (tokenFromHeader) {
      return tokenFromHeader;
    }

    // 2. Cookie에서 조회 (Fallback)
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
   * User ID 조회
   */
  async getUserId(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get(USER_ID_COOKIE)?.value ?? null;
  }

  /**
   * UUID v4 생성 (crypto.randomUUID 사용)
   */
  private generateDeviceId(): string {
    return crypto.randomUUID();
  }
}
