import type { paths } from "@nugudi/types";

type GoogleAuthorizeUrlParams =
  paths["/api/v1/auth/login/google/authorize-url"]["get"]["parameters"]["query"];
type KakaoAuthorizeUrlParams =
  paths["/api/v1/auth/login/kakao/authorize-url"]["get"]["parameters"]["query"];
type NaverAuthorizeUrlParams =
  paths["/api/v1/auth/login/naver/authorize-url"]["get"]["parameters"]["query"];

type GoogleLoginRequest =
  paths["/api/v1/auth/login/google"]["post"]["requestBody"]["content"]["application/json"];
type KakaoLoginRequest =
  paths["/api/v1/auth/login/kakao"]["post"]["requestBody"]["content"]["application/json"];
type NaverLoginRequest =
  paths["/api/v1/auth/login/naver"]["post"]["requestBody"]["content"]["application/json"];

type SignUpSocialRequest =
  paths["/api/v1/auth/signup/social"]["post"]["requestBody"]["content"]["application/json"];

type GoogleAuthorizeUrlResponse =
  paths["/api/v1/auth/login/google/authorize-url"]["get"]["responses"]["200"]["content"]["*/*"];
type KakaoAuthorizeUrlResponse =
  paths["/api/v1/auth/login/kakao/authorize-url"]["get"]["responses"]["200"]["content"]["*/*"];
type NaverAuthorizeUrlResponse =
  paths["/api/v1/auth/login/naver/authorize-url"]["get"]["responses"]["200"]["content"]["*/*"];

type GoogleLoginResponse =
  paths["/api/v1/auth/login/google"]["post"]["responses"][200]["content"]["*/*"];
type KakaoLoginResponse =
  paths["/api/v1/auth/login/kakao"]["post"]["responses"][200]["content"]["*/*"];
type NaverLoginResponse =
  paths["/api/v1/auth/login/naver"]["post"]["responses"][200]["content"]["*/*"];

type RefreshTokenResponse =
  paths["/api/v1/auth/refresh"]["post"]["responses"]["200"]["content"]["*/*"];
type LogoutResponse =
  paths["/api/v1/auth/logout"]["post"]["responses"]["200"]["content"]["*/*"];
type SignUpSocialResponse =
  paths["/api/v1/auth/signup/social"]["post"]["responses"]["201"]["content"]["*/*"];

export type OAuthLoginResponse = {
  status: number;
  data: GoogleLoginResponse | KakaoLoginResponse | NaverLoginResponse;
};

export type TokenResponse = {
  status: number;
  data: RefreshTokenResponse;
};

export type SignUpResponse = {
  status: number;
  data: SignUpSocialResponse;
};

export type {
  GoogleAuthorizeUrlParams,
  KakaoAuthorizeUrlParams,
  NaverAuthorizeUrlParams,
  GoogleLoginRequest,
  KakaoLoginRequest,
  NaverLoginRequest,
  SignUpSocialRequest,
  GoogleAuthorizeUrlResponse,
  KakaoAuthorizeUrlResponse,
  NaverAuthorizeUrlResponse,
  GoogleLoginResponse,
  KakaoLoginResponse,
  NaverLoginResponse,
  RefreshTokenResponse,
  LogoutResponse,
  SignUpSocialResponse,
};
