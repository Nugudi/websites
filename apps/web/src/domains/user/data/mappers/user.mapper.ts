/**
 * User Mapper
 */

import {
  type NicknameAvailability,
  type UserProfile,
  UserProfileEntity,
} from "../../domain/entities/user.entity";
import type { CheckNicknameAvailabilityResponse, UserProfileDTO } from "../dto";

export function userProfileDtoToDomain(dto: UserProfileDTO): UserProfile {
  if (!dto) {
    throw new Error("UserProfileDTO is null or undefined");
  }

  return new UserProfileEntity({
    id: dto.profile?.userId ?? 0,
    nickname: dto.profile?.nickname ?? "",
    email: dto.account?.email ?? undefined,
    profileImageUrl: dto.profile?.profileImageUrl ?? undefined,
    createdAt: dto.profile?.joinDate ?? undefined,
    updatedAt: undefined,
  });
}

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

export const UserMapper = {
  userProfileDtoToDomain,
  nicknameAvailabilityResponseToDomain,
  toDomain: userProfileDtoToDomain,
};
