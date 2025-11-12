/**
 * User Domain Common Types
 *
 * Domain Layer의 공통 타입 정의
 *
 * @remarks
 * - Domain 계층에서 사용하는 공통 타입
 * - Entity, UseCase, Repository에서 참조
 * - Infrastructure 관심사 제외 (순수 비즈니스 타입)
 */

/**
 * 닉네임 가용성 결과
 */
export interface NicknameAvailability {
  /**
   * 닉네임 사용 가능 여부
   */
  available: boolean;

  /**
   * 사용 불가능한 경우 메시지 (선택적)
   */
  message?: string;
}

/**
 * 사용자 역할 타입
 *
 * @remarks
 * - 향후 확장 가능성을 위한 Union Type
 */
export type UserRole = "USER" | "ADMIN";

/**
 * 사용자 상태 타입
 *
 * @remarks
 * - 계정 상태 관리용
 */
export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";
