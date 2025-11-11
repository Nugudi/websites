/**
 * User 도메인 TanStack Query Key 상수
 *
 * Query Key 설계 원칙:
 * - 계층적 구조: ['domain', 'feature', 'identifier']
 * - 일관성: 동일한 리소스는 동일한 key 사용
 * - 타입 안정성: as const로 불변성 보장
 *
 * Note: Query Options는 hooks/queries 폴더에 정의되어 있습니다.
 */

/**
 * 내 프로필 정보 조회 Query Key
 */
export const USER_PROFILE_QUERY_KEY = ["user", "profile", "me"] as const;

/**
 * User Profile Query Key 타입
 */
export type UserProfileQueryKey = typeof USER_PROFILE_QUERY_KEY;
