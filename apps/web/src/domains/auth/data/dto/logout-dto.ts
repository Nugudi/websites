/**
 * Logout DTOs
 *
 * Logout은 헤더로 인증 정보를 전달하므로 별도 DTO가 필요하지 않습니다.
 */

/**
 * Logout 요청은 다음 헤더들을 사용:
 * - Authorization: Bearer {accessToken}
 * - X-Refresh-Token: {refreshToken}
 * - X-Device-ID: {deviceId}
 */
export interface LogoutRequestDTO {
  refreshToken: string;
  deviceId: string;
}
