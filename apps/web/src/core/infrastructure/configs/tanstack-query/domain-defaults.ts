/**
 * Domain-Specific Query Defaults
 *
 * TanStack Query default options per domain
 * - Centralized configuration for consistency
 * - Domain-specific cache and refetch strategies
 */

/**
 * Domain별 기본 Query Options
 *
 * @remarks
 * - staleTime: 데이터가 fresh → stale 상태로 변경되는 시간
 * - gcTime: 비활성 쿼리가 메모리에서 제거되는 시간 (구 cacheTime)
 * - refetchOnWindowFocus: 창 포커스 시 자동 refetch 여부
 * - refetchOnMount: 컴포넌트 마운트 시 자동 refetch 여부
 * - refetchOnReconnect: 네트워크 재연결 시 자동 refetch 여부
 */
export const DOMAIN_QUERY_DEFAULTS = {
  /**
   * User Domain
   * - 사용자 프로필, 인증 정보 등
   * - 변경 빈도가 낮아 긴 staleTime 설정
   */
  user: {
    staleTime: 10 * 60 * 1000, // 10분
    gcTime: 30 * 60 * 1000, // 30분
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  },

  /**
   * Cafeteria Domain
   * - 구내식당 메뉴, 리뷰 등
   * - 주기적으로 업데이트되는 데이터
   */
  cafeteria: {
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 30 * 60 * 1000, // 30분
    refetchOnWindowFocus: false,
  },

  /**
   * Benefit Domain
   * - 복지 정보, 혜택 등
   * - 변경 빈도가 매우 낮음
   */
  benefit: {
    staleTime: 15 * 60 * 1000, // 15분
    gcTime: 30 * 60 * 1000, // 30분
  },

  /**
   * Notification Domain
   * - 알림 데이터
   * - 실시간성이 중요하여 짧은 staleTime
   */
  notification: {
    staleTime: 1 * 60 * 1000, // 1분
    gcTime: 10 * 60 * 1000, // 10분
    refetchOnWindowFocus: true, // 실시간 중요
  },

  /**
   * Stamp Domain
   * - 스탬프, 출석 데이터 등
   * - 주기적으로 업데이트되는 데이터
   */
  stamp: {
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 30 * 60 * 1000, // 30분
  },
} as const;
