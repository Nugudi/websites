/**
 * Refresh Token Provider Interface
 *
 * Infrastructure Layer에서 Refresh Token 로직을 추상화하는 인터페이스
 *
 * Why DIP (Dependency Inversion Principle)?
 * - Infrastructure Layer (AuthenticatedHttpClient)가 Application Layer (RefreshTokenService)를 직접 의존하면 안 됨
 * - 인터페이스를 통해 의존성 역전 (Infrastructure → Interface ← Application)
 * - Clean Architecture 원칙 준수
 *
 * 구현체:
 * - RefreshTokenService (Application Layer) - BFF 전용 구현
 */
export interface RefreshTokenProvider {
  /**
   * Refresh Token 실행
   *
   * @returns { success: boolean, accessToken?: string, refreshToken?: string, error?: string }
   */
  refresh(): Promise<{
    success: boolean;
    accessToken?: string;
    refreshToken?: string;
    error?: string;
  }>;
}
