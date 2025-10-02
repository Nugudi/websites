import type { NextRequest } from "next/server";
import type { Session } from "./session";

/**
 * 지원하는 모든 인증 제공자 목록
 */
export const PROVIDERS = ["kakao", "google", "naver", "credentials"] as const;

/**
 * 인증 제공자 타입
 */
export type ProviderType = (typeof PROVIDERS)[number];

/**
 * OAuth 인증 URL 생성 파라미터
 */
export interface GetAuthorizeUrlParams {
  request: NextRequest;
  redirectUri: string;
}

/**
 * OAuth 토큰 교환 파라미터
 */
export interface ExchangeTokenParams {
  request: NextRequest;
  redirectUri: string;
}

/**
 * 일반 로그인 파라미터
 */
export interface SignInParams {
  email: string;
  password: string;
}

/**
 * 회원가입 파라미터
 */
export interface SignUpParams {
  email: string;
  password: string;
  nickname: string;
}

/**
 * OAuth Provider 인터페이스
 * 카카오, 구글, 네이버 등 OAuth 2.0 기반 제공자 구현
 */
export interface OAuthProvider {
  type: Exclude<ProviderType, "credentials">;

  /**
   * OAuth 인증 URL 생성
   * @returns 리다이렉트할 인증 URL
   */
  getAuthorizeUrl(params: GetAuthorizeUrlParams): Promise<string>;

  /**
   * 인증 코드를 토큰으로 교환하고 세션 생성
   * @returns 생성된 세션
   */
  exchangeToken(params: ExchangeTokenParams): Promise<Session>;
}

/**
 * Credentials Provider 인터페이스
 * 이메일/비밀번호 기반 인증 제공자 구현
 */
export interface CredentialsProvider {
  type: "credentials";

  /**
   * 이메일/비밀번호로 로그인
   * @returns 생성된 세션
   */
  signIn(params: SignInParams): Promise<Session>;

  /**
   * 회원가입
   * @returns 생성된 세션
   */
  signUp(params: SignUpParams): Promise<Session>;
}

/**
 * 모든 Provider의 Union 타입
 */
export type Provider = OAuthProvider | CredentialsProvider;

/**
 * Provider 타입 가드: OAuth Provider 확인
 */
export function isOAuthProvider(provider: Provider): provider is OAuthProvider {
  return provider.type !== "credentials";
}

/**
 * Provider 타입 가드: Credentials Provider 확인
 */
export function isCredentialsProvider(
  provider: Provider,
): provider is CredentialsProvider {
  return provider.type === "credentials";
}

/**
 * 타입 안전한 Provider Registry
 */
export type ProviderRegistry = {
  [K in ProviderType]: K extends "credentials"
    ? CredentialsProvider
    : OAuthProvider;
};
