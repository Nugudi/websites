/**
 * 토큰 제공자 인터페이스
 *
 * 환경(Server/Client)에 따라 다른 방식으로 토큰을 획득하는 추상화
 */
export interface TokenProvider {
  /**
   * 현재 유효한 액세스 토큰을 반환
   *
   * @returns 액세스 토큰 또는 없으면 null
   */
  getToken(): Promise<string | null>;
}
