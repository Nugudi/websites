import type { OAuthProvider } from "../../core/types/common";
import type { AuthRepository } from "../repositories/auth-repository";

export interface GetOAuthAuthorizeUrlUseCase {
  execute(provider: OAuthProvider, redirectUri: string): Promise<string>;
}

export class GetOAuthAuthorizeUrlUseCaseImpl
  implements GetOAuthAuthorizeUrlUseCase
{
  constructor(private readonly authRepository: AuthRepository) {}

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
