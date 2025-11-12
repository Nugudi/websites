/**
 * User Mapper
 *
 * Data Layer의 DTO ↔ Domain Entity 변환
 *
 * @remarks
 * - DTO (API Response) → Domain Entity 변환
 * - UserError 사용 (generic Error 제거)
 * - Clean Architecture: Data Layer 책임
 */

import {
  type NicknameAvailability,
  type UserProfile,
  UserProfileEntity,
} from "../../domain/entities/user.entity";
import { USER_ERROR_CODES, UserError } from "../../domain/errors/user-error";
import type {
  CheckNicknameAvailabilityResponse,
  UserProfileDTO,
} from "../remote/dto";

/**
 * UserProfileDTO → UserProfile Entity 변환
 *
 * @param dto - API 응답 DTO
 * @returns Domain Entity
 * @throws UserError - DTO가 null이거나 필수 데이터 없을 때
 */
export function userProfileDtoToDomain(dto: UserProfileDTO): UserProfile {
  if (!dto) {
    throw new UserError(
      "프로필 데이터가 없습니다.",
      USER_ERROR_CODES.INVALID_USER_DATA,
    );
  }

  // 필수 데이터 검증
  if (!dto.profile?.userId || !dto.profile?.nickname) {
    throw new UserError(
      "프로필 필수 정보가 누락되었습니다.",
      USER_ERROR_CODES.INVALID_USER_DATA,
    );
  }

  return new UserProfileEntity({
    id: dto.profile.userId,
    nickname: dto.profile.nickname,
    email: dto.account?.email ?? undefined,
    profileImageUrl: dto.profile?.profileImageUrl ?? undefined,
    createdAt: dto.profile?.joinDate ?? undefined,
    updatedAt: undefined,
  });
}

/**
 * CheckNicknameAvailabilityResponse → NicknameAvailability 변환
 *
 * @param response - 닉네임 확인 API 응답
 * @returns Domain NicknameAvailability
 */
export function nicknameAvailabilityResponseToDomain(
  response: CheckNicknameAvailabilityResponse,
): NicknameAvailability {
  if (!response.data) {
    throw new UserError(
      "닉네임 확인 데이터가 없습니다.",
      USER_ERROR_CODES.NICKNAME_CHECK_FAILED,
    );
  }

  return {
    available: response.data.available ?? false,
  };
}

/**
 * Mapper 객체 (레거시 지원용)
 *
 * @deprecated 함수를 직접 사용하세요
 */
export const UserMapper = {
  userProfileDtoToDomain,
  nicknameAvailabilityResponseToDomain,
  toDomain: userProfileDtoToDomain,
};
