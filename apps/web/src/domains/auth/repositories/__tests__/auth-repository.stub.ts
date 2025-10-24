import type {
  GoogleAuthorizeUrlParams,
  GoogleAuthorizeUrlResponse,
  GoogleLoginRequest,
  KakaoAuthorizeUrlParams,
  KakaoAuthorizeUrlResponse,
  KakaoLoginRequest,
  LogoutResponse,
  NaverAuthorizeUrlParams,
  NaverAuthorizeUrlResponse,
  NaverLoginRequest,
  OAuthLoginResponse,
  SignUpResponse,
  SignUpSocialRequest,
  TokenResponse,
} from "../types/auth.type";
import type { AuthRepository } from "./auth-repository";

export class AuthRepositoryStub implements AuthRepository {
  async getGoogleAuthorizeUrl(
    _params: GoogleAuthorizeUrlParams,
  ): Promise<GoogleAuthorizeUrlResponse> {
    return {
      success: true,
      data: {
        authorizeUrl: "https://accounts.google.com/o/oauth2/v2/auth?stub=true",
      },
    };
  }

  async getKakaoAuthorizeUrl(
    _params: KakaoAuthorizeUrlParams,
  ): Promise<KakaoAuthorizeUrlResponse> {
    return {
      success: true,
      data: {
        authorizeUrl: "https://kauth.kakao.com/oauth/authorize?stub=true",
      },
    };
  }

  async getNaverAuthorizeUrl(
    _params: NaverAuthorizeUrlParams,
  ): Promise<NaverAuthorizeUrlResponse> {
    return {
      success: true,
      data: {
        authorizeUrl: "https://nid.naver.com/oauth2.0/authorize?stub=true",
      },
    };
  }

  // 기존 회원 시나리오
  async loginWithGoogle(
    _params: GoogleLoginRequest,
  ): Promise<OAuthLoginResponse> {
    return {
      status: 200,
      data: {
        success: true,
        data: {
          status: "EXISTING_USER",
          userId: 1,
          nickname: "테스트사용자",
          accessToken: "stub-access-token",
          refreshToken: "stub-refresh-token",
        },
      },
    };
  }

  // 기존 회원 시나리오
  async loginWithKakao(
    _params: KakaoLoginRequest,
  ): Promise<OAuthLoginResponse> {
    return {
      status: 200,
      data: {
        success: true,
        data: {
          status: "EXISTING_USER",
          userId: 2,
          nickname: "카카오사용자",
          accessToken: "stub-kakao-access-token",
          refreshToken: "stub-kakao-refresh-token",
        },
      },
    };
  }

  // 기존 회원 시나리오
  async loginWithNaver(
    _params: NaverLoginRequest,
  ): Promise<OAuthLoginResponse> {
    return {
      status: 200,
      data: {
        success: true,
        data: {
          status: "EXISTING_USER",
          userId: 3,
          nickname: "네이버사용자",
          accessToken: "stub-naver-access-token",
          refreshToken: "stub-naver-refresh-token",
        },
      },
    };
  }

  async refreshToken(
    _refreshToken: string,
    _deviceId: string,
  ): Promise<TokenResponse> {
    return {
      status: 200,
      data: {
        success: true,
        data: {
          accessToken: "stub-new-access-token",
          refreshToken: "stub-new-refresh-token",
        },
      },
    };
  }

  async logout(
    _refreshToken: string,
    _deviceId: string,
  ): Promise<LogoutResponse> {
    return {
      success: true,
      data: {
        logoutAt: new Date().toISOString(),
      },
    };
  }

  async signUpWithSocial(
    _params: SignUpSocialRequest,
    _registrationToken: string,
  ): Promise<SignUpResponse> {
    return {
      status: 201,
      data: {
        success: true,
        data: {
          userId: 100,
          email: "newuser@example.com",
          nickname: "신규사용자",
          accessToken: "stub-signup-access-token",
          refreshToken: "stub-signup-refresh-token",
        },
      },
    };
  }
}

// NEW_USER 상태를 반환하는 특수 Stub
export class AuthRepositoryNewUserStub extends AuthRepositoryStub {
  // 신규 회원 시나리오
  async loginWithGoogle(
    _params: GoogleLoginRequest,
  ): Promise<OAuthLoginResponse> {
    return {
      status: 202,
      data: {
        success: true,
        data: {
          status: "NEW_USER",
          registrationToken: "stub-registration-token",
        },
      },
    };
  }
}
