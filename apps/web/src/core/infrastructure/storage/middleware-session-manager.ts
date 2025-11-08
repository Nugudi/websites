/**
 * Middleware Session Manager
 *
 * 미들웨어(Edge Runtime) 환경에서 사용하는 Session Manager 구현
 * - NextRequest/NextResponse의 cookies API 사용
 * - next/headers의 cookies()가 아닌 Edge Runtime 호환 API 사용
 */

import type { NextRequest } from "next/server";
import type { SessionData, SessionManager } from "./session-manager";

const ACCESS_TOKEN_COOKIE = "access_token";
const REFRESH_TOKEN_COOKIE = "refresh_token";
const USER_ID_COOKIE = "user_id";
const DEVICE_ID_COOKIE = "device_id";

/**
 * Middleware Session Manager Implementation
 *
 * Edge Runtime에서 NextRequest의 cookies를 사용하여 세션 데이터를 관리합니다.
 * - 쿠키 저장은 NextResponse를 통해 이루어짐
 * - 쿠키 읽기는 NextRequest를 통해 이루어짐
 */
export class MiddlewareSessionManager implements SessionManager {
  constructor(private readonly request: NextRequest) {}

  /**
   * 세션 저장
   * NOTE: 미들웨어에서는 NextResponse에 쿠키를 설정해야 하므로
   * 이 메서드는 실제로 쿠키를 저장하지 않고, 저장할 데이터만 반환합니다.
   */
  async saveSession(_data: SessionData): Promise<void> {
    // 미들웨어에서는 직접 쿠키를 설정할 수 없습니다.
    // NextResponse를 반환할 때 쿠키를 설정해야 합니다.
    throw new Error(
      "MiddlewareSessionManager.saveSession() should not be called directly. " +
        "Use NextResponse.cookies.set() instead.",
    );
  }

  /**
   * 세션 조회
   */
  async getSession(): Promise<SessionData | null> {
    const accessToken = this.request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
    const refreshToken = this.request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
    const userId = this.request.cookies.get(USER_ID_COOKIE)?.value;

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
   * NOTE: 미들웨어에서는 NextResponse에 쿠키 삭제를 설정해야 하므로
   * 이 메서드는 사용하지 않습니다.
   */
  async clearSession(): Promise<void> {
    throw new Error(
      "MiddlewareSessionManager.clearSession() should not be called directly. " +
        "Use NextResponse.cookies.delete() instead.",
    );
  }

  /**
   * 디바이스 ID 조회
   */
  async getDeviceId(): Promise<string> {
    let deviceId = this.request.cookies.get(DEVICE_ID_COOKIE)?.value;

    if (!deviceId) {
      // 디바이스 ID가 없으면 생성 (실제 저장은 NextResponse에서 수행)
      deviceId = crypto.randomUUID();
    }

    return deviceId;
  }

  /**
   * Access Token 조회
   */
  async getAccessToken(): Promise<string | null> {
    return this.request.cookies.get(ACCESS_TOKEN_COOKIE)?.value ?? null;
  }

  /**
   * Refresh Token 조회
   */
  async getRefreshToken(): Promise<string | null> {
    return this.request.cookies.get(REFRESH_TOKEN_COOKIE)?.value ?? null;
  }

  /**
   * User ID 조회
   */
  async getUserId(): Promise<string | null> {
    return this.request.cookies.get(USER_ID_COOKIE)?.value ?? null;
  }
}
