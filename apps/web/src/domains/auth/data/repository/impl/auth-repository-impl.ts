/**
 * Auth Repository Implementation
 *
 * AuthRepository 인터페이스의 구현체
 * - DataSource를 통해 API 호출
 * - Mapper를 통해 DTO → Entity 변환
 * - Domain Layer에서 정의한 인터페이스 충족
 */

import type { Session } from "../../../domain/entities/session.entity";
import type {
  NicknameAvailability,
  User,
} from "../../../domain/entities/user.entity";
import { AUTH_ERROR_CODES, AuthError } from "../../../domain/errors/auth-error";
import type {
  AuthRepository,
  LoginResult,
} from "../../../domain/repositories/auth-repository";
import type { DeviceInfo, SignUpData } from "../../../domain/types/common";
import { SessionMapper } from "../../mapper/session-mapper";
import { UserMapper } from "../../mapper/user-mapper";
import type { AuthRemoteDataSource } from "../datasource/auth-remote-data-source";

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
        // Mapper를 사용한 DTO → Entity 변환
        const user = UserMapper.existingUserLoginToDomain(dto, "google");

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
        // Mapper를 사용한 DTO → Entity 변환
        const user = UserMapper.existingUserLoginToDomain(dto, "kakao");

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
        // Mapper를 사용한 DTO → Entity 변환
        const user = UserMapper.existingUserLoginToDomain(dto, "naver");

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
        deviceId: params.deviceId,
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

  async checkNicknameAvailability(
    nickname: string,
  ): Promise<NicknameAvailability> {
    try {
      const response = await this.dataSource.checkNicknameAvailability({
        nickname,
      });

      if (!response.data) {
        return {
          available: false,
          message: "닉네임 확인에 실패했습니다: 데이터를 받지 못했습니다.",
        };
      }

      return {
        available: response.data.available ?? false,
      };
    } catch (error) {
      throw this.handleError(error, "Failed to check nickname availability");
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
      return new AuthError(message, AUTH_ERROR_CODES.INVALID_USER_DATA, error);
    }

    return new AuthError(message, AUTH_ERROR_CODES.INVALID_USER_DATA, error);
  }
}
