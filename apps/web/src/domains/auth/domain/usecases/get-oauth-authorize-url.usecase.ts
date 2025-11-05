/**
 * Get OAuth Authorize URL UseCase
 *
 * OAuth 인증 URL을 가져옵니다.
 * - 제공자(Google, Kakao, Naver)별로 다른 메서드 호출
 */

import type { OAuthProvider } from "../../core/types/common";
import type { AuthRepository } from "../repositories/auth-repository";

export class GetOAuthAuthorizeUrl {
  constructor(private readonly authRepository: AuthRepository) {}

  /**
   * OAuth 인증 URL 가져오기
   * @param provider OAuth 제공자
   * @param redirectUri 리다이렉트 URI
   * @returns 인증 URL
   */
  async execute(provider: OAuthProvider, redirectUri: string): Promise<string> {
    switch (provider) {
      case "google":
        return await this.authRepository.getGoogleAuthorizeUrl(redirectUri);
      case "kakao":
        return await this.authRepository.getKakaoAuthorizeUrl(redirectUri);
      case "naver":
        return await this.authRepository.getNaverAuthorizeUrl(redirectUri);
      default:
        throw new Error(`Unsupported OAuth provider: ${provider}`);
    }
  }
}
