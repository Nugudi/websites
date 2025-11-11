/**
 * Auth Domain Common Types
 *
 * 순수한 도메인 타입 정의
 *
 * @remarks
 * - DTO, API Response, UI Props와 독립적인 타입만 정의
 * - Enum 대신 Union Type + const assertion 사용
 */

/**
 * OAuth Provider Types
 *
 * @remarks
 * Union Type 패턴 (Enum 대신 사용 - TypeScript 성능 최적화)
 */
export const OAUTH_PROVIDERS = ["google", "kakao", "naver"] as const;
export type OAuthProvider = (typeof OAUTH_PROVIDERS)[number];

/**
 * Device Type
 */
export const DEVICE_TYPES = ["web", "mobile"] as const;
export type DeviceType = (typeof DEVICE_TYPES)[number];

/**
 * Device Information
 *
 * @remarks
 * 순수 도메인 타입 - 디바이스 식별 정보
 */
export interface DeviceInfo {
  deviceId: string;
  deviceType?: DeviceType;
  userAgent?: string;
}

/**
 * Sign Up Data (Domain Type)
 *
 * @remarks
 * 회원가입에 필요한 도메인 데이터
 * - DTO와 독립적인 순수 도메인 타입
 */
export interface SignUpData {
  nickname: string;
  privacyPolicy: boolean;
  termsOfService: boolean;
  locationInfo: boolean;
  marketingEmail?: boolean;
}

/**
 * Success/Failure Result Type
 *
 * @remarks
 * 도메인 작업 결과를 표현하는 타입
 */
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };
