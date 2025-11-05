/**
 * Auth Repository Interface
 *
 * 인증 관련 데이터 접근을 위한 계약(Contract)
 * - Domain Layer는 이 인터페이스만 알고 있음
 * - Data Layer가 구현체를 제공
 * - 테스트 시 Mock 객체로 대체 가능
 */

import type { DeviceInfo, SignUpData } from "../../core/types/common";
import type { Session } from "../entities/session.entity";
import type { User } from "../entities/user.entity";

/**
 * 로그인 결과 타입
 */
export type LoginResult =
  | { type: "EXISTING_USER"; user: User; session: Session }
  | { type: "NEW_USER"; registrationToken: string };

/**
 * AuthRepository Interface
 */
export interface AuthRepository {
  /**
   * Google OAuth 인증 URL 가져오기
   * @param redirectUri 리다이렉트 URI
   * @returns 인증 URL
   */
  getGoogleAuthorizeUrl(redirectUri: string): Promise<string>;

  /**
   * Kakao OAuth 인증 URL 가져오기
   * @param redirectUri 리다이렉트 URI
   * @returns 인증 URL
   */
  getKakaoAuthorizeUrl(redirectUri: string): Promise<string>;

  /**
   * Naver OAuth 인증 URL 가져오기
   * @param redirectUri 리다이렉트 URI
   * @returns 인증 URL
   */
  getNaverAuthorizeUrl(redirectUri: string): Promise<string>;

  /**
   * Google OAuth 로그인
   * @param params 로그인 파라미터
   * @returns 로그인 결과 (기존 사용자 또는 신규 사용자)
   */
  loginWithGoogle(params: {
    code: string;
    redirectUri: string;
    deviceInfo: DeviceInfo;
  }): Promise<LoginResult>;

  /**
   * Kakao OAuth 로그인
   * @param params 로그인 파라미터
   * @returns 로그인 결과 (기존 사용자 또는 신규 사용자)
   */
  loginWithKakao(params: {
    code: string;
    redirectUri: string;
    deviceInfo: DeviceInfo;
  }): Promise<LoginResult>;

  /**
   * Naver OAuth 로그인
   * @param params 로그인 파라미터
   * @returns 로그인 결과 (기존 사용자 또는 신규 사용자)
   */
  loginWithNaver(params: {
    code: string;
    redirectUri: string;
    deviceInfo: DeviceInfo;
  }): Promise<LoginResult>;

  /**
   * 토큰 갱신
   * @param params 갱신 파라미터
   * @returns 새로운 세션
   */
  refreshToken(params: {
    refreshToken: string;
    deviceId: string;
  }): Promise<Session>;

  /**
   * 로그아웃
   * @param params 로그아웃 파라미터
   */
  logout(params: { refreshToken: string; deviceId: string }): Promise<void>;

  /**
   * 소셜 계정으로 회원가입
   * @param params 회원가입 파라미터
   * @returns 생성된 사용자 정보
   */
  signUpWithSocial(params: {
    registrationToken: string;
    userData: SignUpData;
  }): Promise<User>;
}
