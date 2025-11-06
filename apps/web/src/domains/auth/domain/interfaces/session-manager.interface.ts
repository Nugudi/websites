/**
 * SessionManager Interface
 *
 * Domain 레이어에서 정의하는 세션 관리 계약
 * Infrastructure 레이어는 이 인터페이스를 구현해야 합니다.
 */

/**
 * 세션 관리자 인터페이스
 * - UseCase들이 필요로 하는 모든 세션 관련 메서드 정의
 */
export interface SessionManager {
  /**
   * 현재 세션 가져오기
   */
  getSession(): Promise<{
    accessToken: string;
    refreshToken: string;
    userId: string;
  } | null>;

  /**
   * 세션 저장
   */
  saveSession(data: {
    accessToken: string;
    refreshToken: string;
    userId: string;
  }): Promise<void>;

  /**
   * 세션 제거
   */
  clearSession(): Promise<void>;

  /**
   * 디바이스 ID 가져오기
   */
  getDeviceId(): Promise<string>;

  /**
   * Refresh Token 가져오기
   */
  getRefreshToken(): Promise<string | null>;

  /**
   * User ID 가져오기
   */
  getUserId(): Promise<string | null>;
}
