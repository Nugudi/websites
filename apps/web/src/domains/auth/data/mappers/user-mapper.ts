/**
 * User Mapper
 *
 * UserDTO ↔ User Entity 변환
 * - DTO: API 응답 형식
 * - Entity: 도메인 객체 (비즈니스 로직 포함)
 */

import type { OAuthProvider } from "../../core/types/common";
import { type User, UserEntity } from "../../domain/entities/user.entity";
import type { ExistingUserLoginDTO } from "../dto/login-dto";
import type { UserDTO } from "../dto/user-dto";

/**
 * DTO → Entity 변환
 *
 * @param dto API 응답 DTO
 * @returns User Entity
 */
export function userDtoToDomain(dto: UserDTO): User {
  return new UserEntity({
    userId: String(dto.userId),
    email: dto.email ?? undefined, // Convert null to undefined for Entity
    name: dto.nickname,
    provider: "google" as OAuthProvider,
    profileImageUrl: undefined,
    createdAt: undefined,
  });
}

/**
 * Entity → DTO 변환 (필요시)
 *
 * @param entity User Entity
 * @returns UserDTO
 */
export function userDomainToDto(entity: User): UserDTO {
  return {
    userId: Number(entity.getUserId()),
    email: entity.getEmail() ?? null, // Convert undefined to null for DTO
    nickname: entity.getName(),
    accessToken: "",
    refreshToken: "",
    accessTokenExpiresAt: "",
    refreshTokenExpiresAt: "",
  };
}

/**
 * 여러 DTO를 Entity 배열로 변환
 */
export function userDtoListToDomain(dtos: UserDTO[]): User[] {
  return dtos.map((dto) => userDtoToDomain(dto));
}

/**
 * 여러 Entity를 DTO 배열로 변환
 */
export function userDomainListToDto(entities: User[]): UserDTO[] {
  return entities.map((entity) => userDomainToDto(entity));
}

/**
 * ExistingUserLoginDTO → User Entity 변환
 * Login 응답에서 받은 유저 정보를 Entity로 변환
 *
 * @param dto Login 응답 DTO
 * @param provider OAuth Provider (google, kakao, naver)
 * @returns User Entity
 */
export function existingUserLoginDtoToDomain(
  dto: ExistingUserLoginDTO,
  provider: OAuthProvider,
): User {
  return new UserEntity({
    userId: dto.userId,
    email: dto.email ?? undefined,
    name: dto.name,
    provider,
    profileImageUrl: dto.profileImageUrl,
    createdAt: undefined,
  });
}

/**
 * Backward compatibility - 기존 코드에서 사용하는 클래스 형태
 */
export const UserMapper = {
  toDomain: userDtoToDomain,
  toDTO: userDomainToDto,
  toDomainList: userDtoListToDomain,
  toDTOList: userDomainListToDto,
  existingUserLoginToDomain: existingUserLoginDtoToDomain,
};
