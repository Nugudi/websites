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

  async getGoogleAuthorizeUrl(redirectUri: string): Promise<string> {
    try {
      return await this.dataSource.getGoogleAuthorizeUrl(redirectUri);
    } catch (error) {
      throw this.handleError(error, "Failed to get Google authorize URL");
    }
  }

  async getKakaoAuthorizeUrl(redirectUri: string): Promise<string> {
    try {
      return await this.dataSource.getKakaoAuthorizeUrl(redirectUri);
    } catch (error) {
      throw this.handleError(error, "Failed to get Kakao authorize URL");
    }
  }

  async getNaverAuthorizeUrl(redirectUri: string): Promise<string> {
    try {
      return await this.dataSource.getNaverAuthorizeUrl(redirectUri);
    } catch (error) {
      throw this.handleError(error, "Failed to get Naver authorize URL");
    }
  }

  async loginWithGoogle(params: {
    code: string;
    redirectUri: string;
    deviceInfo: DeviceInfo;
  }): Promise<LoginResult> {
    try {
      const dto = await this.dataSource.loginWithGoogle({
        code: params.code,
        redirectUri: params.redirectUri,
        deviceInfo: {
          deviceType: "WEB",
          deviceUniqueId: params.deviceInfo.deviceId,
        },
      });

      if (dto.type === "EXISTING_USER") {
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

  async loginWithKakao(params: {
    code: string;
    redirectUri: string;
    deviceInfo: DeviceInfo;
  }): Promise<LoginResult> {
    try {
      const dto = await this.dataSource.loginWithKakao({
        code: params.code,
        redirectUri: params.redirectUri,
        deviceInfo: {
          deviceType: "WEB",
          deviceUniqueId: params.deviceInfo.deviceId,
        },
      });

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

  async loginWithNaver(params: {
    code: string;
    redirectUri: string;
    deviceInfo: DeviceInfo;
  }): Promise<LoginResult> {
    try {
      const dto = await this.dataSource.loginWithNaver({
        code: params.code,
        redirectUri: params.redirectUri,
        deviceInfo: {
          deviceType: "WEB",
          deviceUniqueId: params.deviceInfo.deviceId,
        },
      });

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

  async refreshToken(params: {
    refreshToken: string;
    deviceId: string;
  }): Promise<Session> {
    try {
      const dto = await this.dataSource.refreshToken({
        refreshToken: params.refreshToken,
        deviceInfo: {
          deviceType: "WEB",
          deviceUniqueId: params.deviceId,
        },
      });

      // Note: userId is temporarily empty here, UseCase layer provides actual userId
      return SessionMapper.fromTokenData(dto, "");
    } catch (error) {
      throw this.handleError(error, "Failed to refresh token");
    }
  }

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

  async signUpWithSocial(params: {
    registrationToken: string;
    userData: SignUpData;
  }): Promise<User> {
    try {
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
            deviceUniqueId: crypto.randomUUID(),
          },
        },
      );

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
