/**
 * User API Endpoints
 *
 * Data Layer의 API 엔드포인트 정의
 *
 * @remarks
 * - API 경로를 한 곳에서 관리
 * - 하드코딩 방지
 * - Clean Architecture: Data Layer의 Infrastructure 관심사
 */

/**
 * User API 엔드포인트
 */
export const USER_ENDPOINTS = {
  /**
   * 내 프로필 조회
   * GET /api/v1/users/me
   */
  GET_MY_PROFILE: "/api/v1/users/me",

  /**
   * 닉네임 중복 확인
   * GET /api/v1/users/check-nickname
   */
  CHECK_NICKNAME: "/api/v1/users/check-nickname",
} as const;
