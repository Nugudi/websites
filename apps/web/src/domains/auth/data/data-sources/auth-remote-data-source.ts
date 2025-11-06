/**
 * Auth Remote DataSource
 *
 * 인증 관련 API 호출 담당
 * - HttpClient를 통해 실제 HTTP 요청 수행
 * - DTO 타입으로 응답 반환
 * - 비즈니스 로직 없음 (순수 데이터 접근만)
 */

import type { HttpClient } from "@/src/shared/infrastructure/http/http-client.interface";
import { AUTH_API_ENDPOINTS } from "../../core/config/constants";
import type {
  ExistingUserLoginDTO,
  GoogleAuthorizeUrlResponseDTO,
  GoogleLoginRequestDTO,
  GoogleLoginResponseDTO,
  LoginResultDTO,
  NewUserLoginDTO,
} from "../dto/login-dto";
import type { LogoutRequestDTO } from "../dto/logout-dto";
import type { SignUpDataDTO, SignUpSocialRequestDTO } from "../dto/sign-up-dto";
import type { RefreshTokenRequestDTO, TokenDataDTO } from "../dto/token-dto";

/**
 * AuthRemoteDataSource
 *
 * 모든 메서드는 DTO를 반환합니다.
 */
export class AuthRemoteDataSource {
  constructor(private readonly httpClient: HttpClient) {}

  /**
   * Google OAuth 인증 URL 가져오기
   */
  async getGoogleAuthorizeUrl(redirectUri: string): Promise<string> {
    const response = await this.httpClient.get<GoogleAuthorizeUrlResponseDTO>(
      AUTH_API_ENDPOINTS.GOOGLE_AUTHORIZE,
      {
        params: { redirectUri },
      },
    );

    // API 응답에서 URL 추출
    return response.data.data?.authorizeUrl ?? "";
  }

  /**
   * Kakao OAuth 인증 URL 가져오기
   */
  async getKakaoAuthorizeUrl(redirectUri: string): Promise<string> {
    const response = await this.httpClient.get<GoogleAuthorizeUrlResponseDTO>(
      AUTH_API_ENDPOINTS.KAKAO_AUTHORIZE,
      {
        params: { redirectUri },
      },
    );

    // API 응답에서 URL 추출
    return response.data.data?.authorizeUrl ?? "";
  }

  /**
   * Naver OAuth 인증 URL 가져오기
   */
  async getNaverAuthorizeUrl(redirectUri: string): Promise<string> {
    const response = await this.httpClient.get<GoogleAuthorizeUrlResponseDTO>(
      AUTH_API_ENDPOINTS.NAVER_AUTHORIZE,
      {
        params: { redirectUri },
      },
    );

    // API 응답에서 URL 추출
    return response.data.data?.authorizeUrl ?? "";
  }

  /**
   * Google OAuth 로그인
   */
  async loginWithGoogle(
    params: GoogleLoginRequestDTO,
  ): Promise<LoginResultDTO> {
    const response = await this.httpClient.post<GoogleLoginResponseDTO>(
      AUTH_API_ENDPOINTS.GOOGLE_LOGIN,
      params,
    );

    const data = response.data.data;

    if (!data) {
      throw new Error("Login response data is empty");
    }

    // 응답 데이터 타입에 따라 분기
    if (data.status === "EXISTING_USER") {
      // accessTokenExpiresAt에서 expiresIn 계산 (초 단위)
      const now = Date.now();
      const expiresAt = data.accessTokenExpiresAt
        ? new Date(data.accessTokenExpiresAt).getTime()
        : now + 3600000; // 기본 1시간
      const expiresIn = Math.floor((expiresAt - now) / 1000);

      return {
        type: "EXISTING_USER",
        userId: String(data.userId ?? ""),
        email: "", // OpenAPI response doesn't provide email
        name: data.nickname ?? "",
        profileImageUrl: data.profileImageUrl ?? undefined,
        accessToken: data.accessToken ?? "",
        refreshToken: data.refreshToken ?? "",
        expiresIn,
      } as ExistingUserLoginDTO;
    }

    return {
      type: "NEW_USER",
      registrationToken: data.registrationToken,
    } as NewUserLoginDTO;
  }

  /**
   * Kakao OAuth 로그인
   */
  async loginWithKakao(params: GoogleLoginRequestDTO): Promise<LoginResultDTO> {
    const response = await this.httpClient.post<GoogleLoginResponseDTO>(
      AUTH_API_ENDPOINTS.KAKAO_LOGIN,
      params,
    );

    const data = response.data.data;

    if (!data) {
      throw new Error("Login response data is empty");
    }

    // 응답 데이터 타입에 따라 분기
    if (data.status === "EXISTING_USER") {
      // accessTokenExpiresAt에서 expiresIn 계산 (초 단위)
      const now = Date.now();
      const expiresAt = data.accessTokenExpiresAt
        ? new Date(data.accessTokenExpiresAt).getTime()
        : now + 3600000; // 기본 1시간
      const expiresIn = Math.floor((expiresAt - now) / 1000);

      return {
        type: "EXISTING_USER",
        userId: String(data.userId ?? ""),
        email: "", // OpenAPI response doesn't provide email
        name: data.nickname ?? "",
        profileImageUrl: data.profileImageUrl ?? undefined,
        accessToken: data.accessToken ?? "",
        refreshToken: data.refreshToken ?? "",
        expiresIn,
      } as ExistingUserLoginDTO;
    }

    return {
      type: "NEW_USER",
      registrationToken: data.registrationToken,
    } as NewUserLoginDTO;
  }

  /**
   * Naver OAuth 로그인
   */
  async loginWithNaver(params: GoogleLoginRequestDTO): Promise<LoginResultDTO> {
    const response = await this.httpClient.post<GoogleLoginResponseDTO>(
      AUTH_API_ENDPOINTS.NAVER_LOGIN,
      params,
    );

    const data = response.data.data;

    if (!data) {
      throw new Error("Login response data is empty");
    }

    // 응답 데이터 타입에 따라 분기
    if (data.status === "EXISTING_USER") {
      // accessTokenExpiresAt에서 expiresIn 계산 (초 단위)
      const now = Date.now();
      const expiresAt = data.accessTokenExpiresAt
        ? new Date(data.accessTokenExpiresAt).getTime()
        : now + 3600000; // 기본 1시간
      const expiresIn = Math.floor((expiresAt - now) / 1000);

      return {
        type: "EXISTING_USER",
        userId: String(data.userId ?? ""),
        email: "", // OpenAPI response doesn't provide email
        name: data.nickname ?? "",
        profileImageUrl: data.profileImageUrl ?? undefined,
        accessToken: data.accessToken ?? "",
        refreshToken: data.refreshToken ?? "",
        expiresIn,
      } as ExistingUserLoginDTO;
    }

    return {
      type: "NEW_USER",
      registrationToken: data.registrationToken,
    } as NewUserLoginDTO;
  }

  /**
   * 토큰 갱신
   *
   * NOTE: API는 requestBody가 아닌 헤더를 사용합니다:
   * - Authorization: Bearer {refreshToken}
   * - X-Device-ID: {deviceId}
   */
  async refreshToken(params: RefreshTokenRequestDTO): Promise<TokenDataDTO> {
    const response = await this.httpClient.post<{ data: TokenDataDTO }>(
      AUTH_API_ENDPOINTS.REFRESH_TOKEN,
      {}, // Empty body
      {
        headers: {
          Authorization: `Bearer ${params.refreshToken}`,
          "X-Device-ID": params.deviceId,
        },
      },
    );

    return response.data.data;
  }

  /**
   * 로그아웃
   */
  async logout(params: LogoutRequestDTO): Promise<void> {
    await this.httpClient.post(
      AUTH_API_ENDPOINTS.LOGOUT,
      {}, // Empty body
      {
        headers: {
          "X-Refresh-Token": params.refreshToken,
          "X-Device-ID": params.deviceId,
        },
      },
    );
  }

  /**
   * 소셜 계정으로 회원가입
   */
  async signUpWithSocial(
    registrationToken: string,
    params: SignUpSocialRequestDTO,
  ): Promise<SignUpDataDTO> {
    const response = await this.httpClient.post<{ data: SignUpDataDTO }>(
      AUTH_API_ENDPOINTS.SIGNUP_SOCIAL,
      params,
      {
        headers: {
          Authorization: `Bearer ${registrationToken}`,
        },
      },
    );

    return response.data.data;
  }
}
