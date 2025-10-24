import type { HttpClient } from "@/src/shared/infrastructure/http";
import type {
  GoogleAuthorizeUrlParams,
  GoogleAuthorizeUrlResponse,
  GoogleLoginRequest,
  GoogleLoginResponse,
  KakaoAuthorizeUrlParams,
  KakaoAuthorizeUrlResponse,
  KakaoLoginRequest,
  KakaoLoginResponse,
  LogoutResponse,
  NaverAuthorizeUrlParams,
  NaverAuthorizeUrlResponse,
  NaverLoginRequest,
  NaverLoginResponse,
  OAuthLoginResponse,
  RefreshTokenResponse,
  SignUpResponse,
  SignUpSocialRequest,
  SignUpSocialResponse,
  TokenResponse,
} from "../types/auth.type";

export interface AuthRepository {
  getGoogleAuthorizeUrl(
    params: GoogleAuthorizeUrlParams,
  ): Promise<GoogleAuthorizeUrlResponse>;
  getKakaoAuthorizeUrl(
    params: KakaoAuthorizeUrlParams,
  ): Promise<KakaoAuthorizeUrlResponse>;
  getNaverAuthorizeUrl(
    params: NaverAuthorizeUrlParams,
  ): Promise<NaverAuthorizeUrlResponse>;
  loginWithGoogle(params: GoogleLoginRequest): Promise<OAuthLoginResponse>;
  loginWithKakao(params: KakaoLoginRequest): Promise<OAuthLoginResponse>;
  loginWithNaver(params: NaverLoginRequest): Promise<OAuthLoginResponse>;
  refreshToken(refreshToken: string, deviceId: string): Promise<TokenResponse>;
  logout(refreshToken: string, deviceId: string): Promise<LogoutResponse>;
  signUpWithSocial(
    params: SignUpSocialRequest,
    registrationToken: string,
  ): Promise<SignUpResponse>;
}

export class AuthRepositoryImpl implements AuthRepository {
  constructor(private readonly httpClient: HttpClient) {}

  async getGoogleAuthorizeUrl(
    params: GoogleAuthorizeUrlParams,
  ): Promise<GoogleAuthorizeUrlResponse> {
    const queryString = new URLSearchParams(
      params as Record<string, string>,
    ).toString();
    const url = `/api/v1/auth/login/google/authorize-url${queryString ? `?${queryString}` : ""}`;

    const response = await this.httpClient.get<GoogleAuthorizeUrlResponse>(url);
    return response.data;
  }

  async getKakaoAuthorizeUrl(
    params: KakaoAuthorizeUrlParams,
  ): Promise<KakaoAuthorizeUrlResponse> {
    const queryString = new URLSearchParams(
      params as Record<string, string>,
    ).toString();
    const url = `/api/v1/auth/login/kakao/authorize-url${queryString ? `?${queryString}` : ""}`;

    const response = await this.httpClient.get<KakaoAuthorizeUrlResponse>(url);
    return response.data;
  }

  async getNaverAuthorizeUrl(
    params: NaverAuthorizeUrlParams,
  ): Promise<NaverAuthorizeUrlResponse> {
    const queryString = new URLSearchParams(
      params as Record<string, string>,
    ).toString();
    const url = `/api/v1/auth/login/naver/authorize-url${queryString ? `?${queryString}` : ""}`;

    const response = await this.httpClient.get<NaverAuthorizeUrlResponse>(url);
    return response.data;
  }

  async loginWithGoogle(
    params: GoogleLoginRequest,
  ): Promise<OAuthLoginResponse> {
    const response = await this.httpClient.post<GoogleLoginResponse>(
      "/api/v1/auth/login/google",
      params,
    );

    return {
      status: response.status,
      data: response.data,
    };
  }

  async loginWithKakao(params: KakaoLoginRequest): Promise<OAuthLoginResponse> {
    const response = await this.httpClient.post<KakaoLoginResponse>(
      "/api/v1/auth/login/kakao",
      params,
    );

    return {
      status: response.status,
      data: response.data,
    };
  }

  async loginWithNaver(params: NaverLoginRequest): Promise<OAuthLoginResponse> {
    const response = await this.httpClient.post<NaverLoginResponse>(
      "/api/v1/auth/login/naver",
      params,
    );

    return {
      status: response.status,
      data: response.data,
    };
  }

  // Note: RefreshToken은 Authorization 헤더에 직접 전달 (AccessToken과 다른 방식)
  async refreshToken(
    refreshToken: string,
    deviceId: string,
  ): Promise<TokenResponse> {
    const response = await this.httpClient.post<RefreshTokenResponse>(
      "/api/v1/auth/refresh",
      undefined,
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
          "X-Device-ID": deviceId,
        },
      },
    );

    return {
      status: response.status,
      data: response.data,
    };
  }

  // Note: RefreshToken을 Authorization 헤더에 직접 전달
  async logout(
    refreshToken: string,
    deviceId: string,
  ): Promise<LogoutResponse> {
    const response = await this.httpClient.post<LogoutResponse>(
      "/api/v1/auth/logout",
      undefined,
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
          "X-Device-ID": deviceId,
        },
      },
    );

    return response.data;
  }

  // Note: X-Registration-Token 헤더 사용 (일회성 토큰)
  async signUpWithSocial(
    params: SignUpSocialRequest,
    registrationToken: string,
  ): Promise<SignUpResponse> {
    const response = await this.httpClient.post<SignUpSocialResponse>(
      "/api/v1/auth/signup/social",
      params,
      {
        headers: {
          "X-Registration-Token": registrationToken,
        },
      },
    );

    return {
      status: response.status,
      data: response.data,
    };
  }
}
