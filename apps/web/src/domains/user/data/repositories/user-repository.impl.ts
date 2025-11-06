/**
 * User Repository Implementation
 *
 * Implements UserRepository interface from domain layer
 * - Uses UserRemoteDataSource for API calls
 * - Converts DTOs to domain entities using mapper
 * - Handles errors and data validation
 */

import type {
  NicknameAvailability,
  UserProfile,
} from "../../domain/entities/user.entity";
import type { UserRepository } from "../../domain/repositories/user-repository.interface";
import type { UserRemoteDataSource } from "../data-sources/user-remote-data-source";
import {
  nicknameAvailabilityResponseToDomain,
  userProfileDtoToDomain,
} from "../mappers/user.mapper";

export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly dataSource: UserRemoteDataSource) {}

  async getMyProfile(): Promise<UserProfile> {
    const response = await this.dataSource.getMyProfile();

    if (!response.data) {
      throw new Error("Failed to fetch user profile: No data returned");
    }

    return userProfileDtoToDomain(response.data);
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
      return {
        available: false,
        message:
          error instanceof Error
            ? error.message
            : "닉네임 확인에 실패했습니다.",
      };
    }
  }
}
