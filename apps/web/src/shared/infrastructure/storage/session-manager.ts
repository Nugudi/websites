/**
 * Session Manager
 *
 * 세션 및 토큰 관리를 담당하는 Infrastructure Layer
 * - 토큰 저장/조회/삭제
 * - 디바이스 ID 관리
 * - Server/Client 환경에 따른 다른 구현체 제공
 */

/**
 * Session Data Interface
 */
export interface SessionData {
  accessToken: string;
  refreshToken: string;
  userId?: number;
}

/**
 * Session Manager Interface
 *
 * Server/Client에서 공통으로 사용할 세션 관리 인터페이스
 */
export interface SessionManager {
  /**
   * 세션 저장
   */
  saveSession(data: SessionData): Promise<void>;

  /**
   * 세션 조회
   */
  getSession(): Promise<SessionData | null>;

  /**
   * 세션 삭제
   */
  clearSession(): Promise<void>;

  /**
   * 디바이스 ID 조회
   */
  getDeviceId(): Promise<string>;

  /**
   * Access Token 조회
   */
  getAccessToken(): Promise<string | null>;

  /**
   * Refresh Token 조회
   */
  getRefreshToken(): Promise<string | null>;
}
