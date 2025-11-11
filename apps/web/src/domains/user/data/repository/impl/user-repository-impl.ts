/**
 * User Repository Implementation
 *
 * Data Layer의 Repository 구현
 *
 * @remarks
 * - Domain Repository 인터페이스 구현
 * - DataSource를 통한 데이터 조회
 * - DTO → Entity 변환 (Mapper 사용)
 * - HTTP Error → Domain Error 변환 (Error Mapper 사용)
 * - Clean Architecture: Data Layer (비즈니스 로직 없음)
 */

import type { HttpError } from "@core/infrastructure/http/fetch-http-client";
import type {
  NicknameAvailability,
  UserProfile,
} from "../../../domain/entities/user.entity";
import { USER_ERROR_CODES, UserError } from "../../../domain/errors/user-error";
import type { UserRepository } from "../../../domain/repositories/user-repository.interface";
import {
  nicknameAvailabilityResponseToDomain,
  userProfileDtoToDomain,
} from "../../mapper/user.mapper";
import {
  fromHttpError,
  fromUnknownError,
} from "../../remote/error/user-error-mapper";
import type { UserRemoteDataSource } from "../datasource/user-remote-data-source";

export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly dataSource: UserRemoteDataSource) {}

  async getMyProfile(): Promise<UserProfile> {
    try {
      const response = await this.dataSource.getMyProfile();

      if (!response.data) {
        throw new UserError(
          "프로필 데이터가 없습니다.",
          USER_ERROR_CODES.PROFILE_NOT_FOUND,
        );
      }

      return userProfileDtoToDomain(response.data);
    } catch (error) {
      // HttpError인 경우 Domain Error로 변환
      if (this.isHttpError(error)) {
        throw fromHttpError(error);
      }

      // UserError인 경우 그대로 전파
      if (error instanceof UserError) {
        throw error;
      }

      // 그 외 Unknown Error
      throw fromUnknownError(error, "프로필 조회에 실패했습니다.");
    }
  }

  async checkNicknameAvailability(
    nickname: string,
  ): Promise<NicknameAvailability> {
    try {
      const response = await this.dataSource.checkNicknameAvailability({
        nickname,
      });

      return nicknameAvailabilityResponseToDomain(response);
    } catch (error) {
      // HttpError인 경우 Domain Error로 변환
      if (this.isHttpError(error)) {
        throw fromHttpError(error);
      }

      // UserError인 경우 그대로 전파
      if (error instanceof UserError) {
        throw error;
      }

      // 그 외 Unknown Error - 닉네임 확인 실패
      throw fromUnknownError(error, "닉네임 확인에 실패했습니다.");
    }
  }

  /**
   * HttpError 타입 가드
   */
  private isHttpError(error: unknown): error is HttpError {
    return (
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      typeof (error as HttpError).status === "number"
    );
  }
}
