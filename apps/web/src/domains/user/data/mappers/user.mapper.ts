/**
 * User Mapper
 *
 * UserProfileDTO ↔ UserProfile Entity 변환
 * - DTO: API 응답 형식 (OpenAPI)
 * - Entity: 도메인 객체 (비즈니스 로직 포함)
 */

import type {
  NicknameAvailability,
  UserProfile,
} from "../../domain/entities/user.entity";
import type { CheckNicknameAvailabilityResponse, UserProfileDTO } from "../dto";

/**
 * UserProfileDTO → UserProfile Entity 변환
 *
 * @param dto API 응답 DTO
 * @returns UserProfile Entity
 */
export function userProfileDtoToDomain(dto: UserProfileDTO): UserProfile {
  if (!dto) {
    throw new Error("UserProfileDTO is null or undefined");
  }

  return {
    id: dto.profile?.userId ?? 0,
    nickname: dto.profile?.nickname ?? "",
    email: dto.account?.email ?? undefined,
    profileImageUrl: dto.profile?.profileImageUrl ?? undefined,
    createdAt: dto.profile?.joinDate ?? undefined,
    updatedAt: undefined, // Not available in current DTO
  };
}

/**
 * CheckNicknameAvailabilityResponse → NicknameAvailability Entity 변환
 *
 * @param response API 응답
 * @returns NicknameAvailability Entity
 */
export function nicknameAvailabilityResponseToDomain(
  response: CheckNicknameAvailabilityResponse,
): NicknameAvailability {
  if (!response.data) {
    return {
      available: false,
      message: "닉네임 확인에 실패했습니다: 데이터를 받지 못했습니다.",
    };
  }

  return {
    available: response.data.available ?? false,
  };
}

/**
 * Backward compatibility - 기존 코드에서 사용하는 클래스 형태
 */
export const UserMapper = {
  userProfileDtoToDomain,
  nicknameAvailabilityResponseToDomain,
  toDomain: userProfileDtoToDomain,
};
