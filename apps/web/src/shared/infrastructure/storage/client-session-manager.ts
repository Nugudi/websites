/**
 * Client Session Manager
 *
 * 브라우저 환경에서 사용하는 Session Manager 구현
 * - localStorage를 사용한 토큰 저장
 * - 디바이스 ID 생성 및 관리
 */

import type { SessionData, SessionManager } from "./session-manager";

const SESSION_KEY = "nugudi_session";
const DEVICE_ID_KEY = "nugudi_device_id";

/**
 * Client Session Manager Implementation
 *
 * localStorage를 사용하여 세션 데이터를 관리합니다.
 */
export class ClientSessionManager implements SessionManager {
  /**
   * 세션 저장
   */
  async saveSession(data: SessionData): Promise<void> {
    if (typeof window === "undefined") {
      throw new Error("ClientSessionManager can only be used in browser");
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify(data));
  }

  /**
   * 세션 조회
   */
  async getSession(): Promise<SessionData | null> {
    if (typeof window === "undefined") {
      return null;
    }

    const sessionJson = localStorage.getItem(SESSION_KEY);
    if (!sessionJson) {
      return null;
    }

    try {
      return JSON.parse(sessionJson) as SessionData;
    } catch {
      return null;
    }
  }

  /**
   * 세션 삭제
   */
  async clearSession(): Promise<void> {
    if (typeof window === "undefined") {
      return;
    }

    localStorage.removeItem(SESSION_KEY);
  }

  /**
   * 디바이스 ID 조회 (없으면 생성)
   */
  async getDeviceId(): Promise<string> {
    if (typeof window === "undefined") {
      throw new Error("ClientSessionManager can only be used in browser");
    }

    let deviceId = localStorage.getItem(DEVICE_ID_KEY);

    if (!deviceId) {
      deviceId = this.generateDeviceId();
      localStorage.setItem(DEVICE_ID_KEY, deviceId);
    }

    return deviceId;
  }

  /**
   * Access Token 조회
   */
  async getAccessToken(): Promise<string | null> {
    const session = await this.getSession();
    return session?.accessToken ?? null;
  }

  /**
   * Refresh Token 조회
   */
  async getRefreshToken(): Promise<string | null> {
    const session = await this.getSession();
    return session?.refreshToken ?? null;
  }

  /**
   * UUID v4 생성 (crypto.randomUUID 사용)
   */
  private generateDeviceId(): string {
    return crypto.randomUUID();
  }
}
