/**
 * Auth Repository Implementation
 *
 * AuthRepository 인터페이스의 구현체
 * - DataSource를 통해 API 호출
 * - Mapper를 통해 DTO → Entity 변환
 * - Domain Layer에서 정의한 인터페이스 충족
 */

import { AuthError } from "../../core/errors/auth-error";
import type {
  DeviceInfo,
  OAuthProvider,
  SignUpData,
} from "../../core/types/common";
import type { Session } from "../../domain/entities/session.entity";
import type { User } from "../../domain/entities/user.entity";
import { UserEntity } from "../../domain/entities/user.entity";
import type {
  AuthRepository,
  LoginResult,
} from "../../domain/repositories/auth-repository";
import type { AuthRemoteDataSource } from "../data-sources/auth-remote-data-source";
import { SessionMapper } from "../mappers/session-mapper";
import { UserMapper } from "../mappers/user-mapper";

/**
 * AuthRepositoryImpl
 */
export class AuthRepositoryImpl implements AuthRepository {
  constructor(private readonly dataSource: AuthRemoteDataSource) {}

  /**
   * Google OAuth 인증 URL 가져오기
   */
  async getGoogleAuthorizeUrl(redirectUri: string): Promise<string> {
    try {
      return await this.dataSource.getGoogleAuthorizeUrl(redirectUri);
    } catch (error) {
      throw this.handleError(error, "Failed to get Google authorize URL");
    }
  }

  /**
   * Kakao OAuth 인증 URL 가져오기
   */
  async getKakaoAuthorizeUrl(redirectUri: string): Promise<string> {
    try {
      return await this.dataSource.getKakaoAuthorizeUrl(redirectUri);
    } catch (error) {
      throw this.handleError(error, "Failed to get Kakao authorize URL");
    }
  }

  /**
   * Naver OAuth 인증 URL 가져오기
   */
  async getNaverAuthorizeUrl(redirectUri: string): Promise<string> {
    try {
      return await this.dataSource.getNaverAuthorizeUrl(redirectUri);
    } catch (error) {
      throw this.handleError(error, "Failed to get Naver authorize URL");
    }
  }

  /**
   * Google OAuth 로그인
   */
  async loginWithGoogle(params: {
    code: string;
    redirectUri: string;
    deviceInfo: DeviceInfo;
  }): Promise<LoginResult> {
    try {
      // 1. DataSource에서 DTO 가져오기
      const dto = await this.dataSource.loginWithGoogle({
        code: params.code,
        redirectUri: params.redirectUri,
        deviceInfo: {
          deviceType: "WEB", // OpenAPI 타입: "IOS" | "ANDROID" | "WEB"
          deviceUniqueId: params.deviceInfo.deviceId,
        },
      });

      // 2. DTO 타입에 따라 분기 + Mapper로 Entity 변환
      if (dto.type === "EXISTING_USER") {
        // Login response uses different structure than UserDTO
        const user = new UserEntity({
          userId: dto.userId,
          email: dto.email ?? undefined, // Convert null to undefined for Entity
          name: dto.name,
          provider: "google" as OAuthProvider,
          profileImageUrl: dto.profileImageUrl,
          createdAt: undefined,
        });

        const session = SessionMapper.toDomain({
          accessToken: dto.accessToken,
          refreshToken: dto.refreshToken,
          expiresIn: dto.expiresIn,
          userId: dto.userId,
        });

        return {
          type: "EXISTING_USER",
          user,
          session,
        };
      }

      return {
        type: "NEW_USER",
        registrationToken: dto.registrationToken,
      };
    } catch (error) {
      throw this.handleError(error, "Failed to login with Google");
    }
  }

  /**
   * Kakao OAuth 로그인
   */
  async loginWithKakao(params: {
    code: string;
    redirectUri: string;
    deviceInfo: DeviceInfo;
  }): Promise<LoginResult> {
    try {
      // 1. DataSource에서 DTO 가져오기
      const dto = await this.dataSource.loginWithKakao({
        code: params.code,
        redirectUri: params.redirectUri,
        deviceInfo: {
          deviceType: "WEB",
          deviceUniqueId: params.deviceInfo.deviceId,
        },
      });

      // 2. DTO 타입에 따라 분기 + Mapper로 Entity 변환
      if (dto.type === "EXISTING_USER") {
        const user = new UserEntity({
          userId: dto.userId,
          email: dto.email ?? undefined, // Convert null to undefined for Entity
          name: dto.name,
          provider: "kakao" as OAuthProvider,
          profileImageUrl: dto.profileImageUrl,
          createdAt: undefined,
        });

        const session = SessionMapper.toDomain({
          accessToken: dto.accessToken,
          refreshToken: dto.refreshToken,
          expiresIn: dto.expiresIn,
          userId: dto.userId,
        });

        return {
          type: "EXISTING_USER",
          user,
          session,
        };
      }

      return {
        type: "NEW_USER",
        registrationToken: dto.registrationToken,
      };
    } catch (error) {
      throw this.handleError(error, "Failed to login with Kakao");
    }
  }

  /**
   * Naver OAuth 로그인
   */
  async loginWithNaver(params: {
    code: string;
    redirectUri: string;
    deviceInfo: DeviceInfo;
  }): Promise<LoginResult> {
    try {
      // 1. DataSource에서 DTO 가져오기
      const dto = await this.dataSource.loginWithNaver({
        code: params.code,
        redirectUri: params.redirectUri,
        deviceInfo: {
          deviceType: "WEB",
          deviceUniqueId: params.deviceInfo.deviceId,
        },
      });

      // 2. DTO 타입에 따라 분기 + Mapper로 Entity 변환
      if (dto.type === "EXISTING_USER") {
        const user = new UserEntity({
          userId: dto.userId,
          email: dto.email ?? undefined, // Convert null to undefined for Entity
          name: dto.name,
          provider: "naver" as OAuthProvider,
          profileImageUrl: dto.profileImageUrl,
          createdAt: undefined,
        });

        const session = SessionMapper.toDomain({
          accessToken: dto.accessToken,
          refreshToken: dto.refreshToken,
          expiresIn: dto.expiresIn,
          userId: dto.userId,
        });

        return {
          type: "EXISTING_USER",
          user,
          session,
        };
      }

      return {
        type: "NEW_USER",
        registrationToken: dto.registrationToken,
      };
    } catch (error) {
      throw this.handleError(error, "Failed to login with Naver");
    }
  }

  /**
   * 토큰 갱신
   */
  async refreshToken(params: {
    refreshToken: string;
    deviceId: string;
  }): Promise<Session> {
    try {
      // 1. DataSource에서 DTO 가져오기
      const dto = await this.dataSource.refreshToken({
        refreshToken: params.refreshToken,
        deviceInfo: {
          deviceType: "WEB",
          deviceUniqueId: params.deviceId,
        },
      });

      // 2. Mapper로 Entity 변환
      // Note: userId는 현재 세션에서 가져와야 하므로, 호출하는 곳에서 제공 필요
      // 여기서는 임시로 빈 문자열 사용 (실제로는 UseCase에서 처리)
      return SessionMapper.fromTokenData(dto, "");
    } catch (error) {
      throw this.handleError(error, "Failed to refresh token");
    }
  }

  /**
   * 로그아웃
   */
  async logout(params: {
    refreshToken: string;
    deviceId: string;
  }): Promise<void> {
    try {
      await this.dataSource.logout({
        refreshToken: params.refreshToken,
        deviceId: params.deviceId,
      });
    } catch (error) {
      throw this.handleError(error, "Failed to logout");
    }
  }

  /**
   * 소셜 계정으로 회원가입
   */
  async signUpWithSocial(params: {
    registrationToken: string;
    userData: SignUpData;
  }): Promise<User> {
    try {
      // 1. DataSource에서 DTO 가져오기
      const dto = await this.dataSource.signUpWithSocial(
        params.registrationToken,
        {
          nickname: params.userData.nickname,
          privacyPolicy: params.userData.privacyPolicy,
          termsOfService: params.userData.termsOfService,
          locationInfo: params.userData.locationInfo,
          marketingEmail: params.userData.marketingEmail,
          deviceInfo: {
            deviceType: "WEB",
            deviceUniqueId: crypto.randomUUID(), // Generate unique ID
          },
        },
      );

      // 2. Mapper로 Entity 변환
      return UserMapper.toDomain(dto);
    } catch (error) {
      throw this.handleError(error, "Failed to sign up with social account");
    }
  }

  /**
   * 에러 처리 헬퍼
   */
  private handleError(error: unknown, message: string): AuthError {
    if (error instanceof AuthError) {
      return error;
    }

    if (error instanceof Error) {
      return new AuthError(message, undefined, undefined, error);
    }

    return new AuthError(message, undefined, undefined, error);
  }
}
