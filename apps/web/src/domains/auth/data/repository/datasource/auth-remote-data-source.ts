/**
 * Auth Remote DataSource Interface
 *
 * 인증 관련 원격 데이터 접근 인터페이스
 */

import type {
  GoogleLoginRequestDTO,
  LogoutRequestDTO,
  RefreshTokenRequestDTO,
  SignUpSocialRequestDTO,
} from "../../remote/dto/request";
import type {
  CheckNicknameAvailabilityParams,
  CheckNicknameAvailabilityResponse,
  LoginResultDTO,
  SignUpDataDTO,
  TokenDataDTO,
} from "../../remote/dto/response";

/**
 * AuthRemoteDataSource Interface
 *
 * Repository 레이어에서 사용하는 DataSource 추상화
 */
export interface AuthRemoteDataSource {
  /**
   * Google OAuth 인증 URL 가져오기
   */
  getGoogleAuthorizeUrl(redirectUri: string): Promise<string>;

  /**
   * Kakao OAuth 인증 URL 가져오기
   */
  getKakaoAuthorizeUrl(redirectUri: string): Promise<string>;

  /**
   * Naver OAuth 인증 URL 가져오기
   */
  getNaverAuthorizeUrl(redirectUri: string): Promise<string>;

  /**
   * Google OAuth 로그인
   */
  loginWithGoogle(params: GoogleLoginRequestDTO): Promise<LoginResultDTO>;

  /**
   * Kakao OAuth 로그인
   */
  loginWithKakao(params: GoogleLoginRequestDTO): Promise<LoginResultDTO>;

  /**
   * Naver OAuth 로그인
   */
  loginWithNaver(params: GoogleLoginRequestDTO): Promise<LoginResultDTO>;

  /**
   * 토큰 갱신
   */
  refreshToken(params: RefreshTokenRequestDTO): Promise<TokenDataDTO>;

  /**
   * 로그아웃
   */
  logout(params: LogoutRequestDTO): Promise<void>;

  /**
   * 소셜 계정으로 회원가입
   */
  signUpWithSocial(
    registrationToken: string,
    params: SignUpSocialRequestDTO,
  ): Promise<SignUpDataDTO>;

  /**
   * 닉네임 사용 가능 여부 확인
   */
  checkNicknameAvailability(
    params: CheckNicknameAvailabilityParams,
  ): Promise<CheckNicknameAvailabilityResponse>;
}
