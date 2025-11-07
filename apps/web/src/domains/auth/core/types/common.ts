/**
 * Auth Domain Common Types
 *
 * 여러 레이어에서 공통으로 사용되는 타입 정의
 */

/**
 * OAuth Provider 타입
 */
export type OAuthProvider = "google" | "kakao" | "naver";

/**
 * Device Information
 */
export interface DeviceInfo {
  deviceId: string;
  deviceType?: "web" | "mobile";
  userAgent?: string;
}

/**
 * SignUp Request Data (OpenAPI 스펙에 맞춤)
 */
export interface SignUpData {
  nickname: string;
  privacyPolicy: boolean; // 개인정보처리방침 동의
  termsOfService: boolean; // 서비스 이용약관 동의
  locationInfo: boolean; // 위치정보 이용약관 동의
  marketingEmail?: boolean; // 마케팅 정보 수신 동의 (선택)
}

/**
 * Success/Failure Result Type
 */
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };
