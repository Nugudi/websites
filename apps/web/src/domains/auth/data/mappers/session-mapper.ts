/**
 * Session Mapper
 *
 * SessionDTO ↔ Session Entity 변환
 */

import {
  type Session,
  SessionEntity,
} from "../../domain/entities/session.entity";
import type { TokenDataDTO } from "../dto/token-dto";

/**
 * DTO → Entity 변환
 *
 * @param dto Token 응답 DTO
 * @returns Session Entity
 */
export function sessionDtoToDomain(dto: {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds
  userId: string;
}): Session {
  // expiresIn (초)을 기반으로 만료 시간 계산
  const expiresAt = new Date();
  expiresAt.setSeconds(expiresAt.getSeconds() + dto.expiresIn);

  return new SessionEntity({
    accessToken: dto.accessToken,
    refreshToken: dto.refreshToken,
    userId: dto.userId,
    expiresAt,
  });
}

/**
 * TokenDataDTO → Entity 변환
 */
export function tokenDataToSession(dto: TokenDataDTO, userId: string): Session {
  // accessTokenExpiresAt에서 expiresIn 계산 (초 단위)
  const now = Date.now();
  const expiresAt = dto.accessTokenExpiresAt
    ? new Date(dto.accessTokenExpiresAt).getTime()
    : now + 3600000; // 기본 1시간
  const expiresIn = Math.floor((expiresAt - now) / 1000);

  return sessionDtoToDomain({
    accessToken: dto.accessToken,
    refreshToken: dto.refreshToken,
    expiresIn,
    userId,
  });
}

/**
 * 🆕 Entity → Storage Data 변환 (Clean Architecture)
 *
 * Mapper가 직접 Storage 형식 변환을 담당 (Entity는 비즈니스 로직만)
 *
 * @param entity Session Entity
 * @returns Storage에 저장할 수 있는 형식 (ISO string)
 */
export function sessionDomainToStorageData(entity: Session): {
  accessToken: string;
  refreshToken: string;
  userId: string;
  expiresAt: string; // ISO string
} {
  return {
    accessToken: entity.getAccessToken(),
    refreshToken: entity.getRefreshToken(),
    userId: entity.getUserId(),
    expiresAt: entity.getExpiresAt().toISOString(), // Mapper가 ISO 변환
  };
}

/**
 * 🆕 Storage Data → Entity 변환 (Clean Architecture)
 *
 * Mapper가 직접 Storage 형식에서 Entity 복원을 담당
 *
 * @param data Storage에서 읽은 데이터
 * @returns Session Entity
 */
export function sessionStorageDataToDomain(data: {
  accessToken: string;
  refreshToken: string;
  userId: string;
  expiresAt: string; // ISO string
}): Session {
  return new SessionEntity({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    userId: data.userId,
    expiresAt: new Date(data.expiresAt), // Mapper가 Date 변환
  });
}

/**
 * Entity → 저장 가능한 형식으로 변환
 *
 * @deprecated Use sessionDomainToStorageData instead
 */
export function sessionToStorageFormat(entity: Session): {
  accessToken: string;
  refreshToken: string;
  userId: string;
  expiresAt: string; // ISO string
} {
  return sessionDomainToStorageData(entity);
}

/**
 * 저장된 형식에서 Entity 복원
 *
 * @deprecated Use sessionStorageDataToDomain instead
 */
export function sessionFromStorageFormat(data: {
  accessToken: string;
  refreshToken: string;
  userId: string;
  expiresAt: string;
}): Session {
  return sessionStorageDataToDomain(data);
}

/**
 * Backward compatibility - 기존 코드에서 사용하는 클래스 형태
 */
export const SessionMapper = {
  toDomain: sessionDtoToDomain,
  fromTokenData: tokenDataToSession,
  // 🆕 표준 네이밍 (다른 mapper들과 일관성)
  toStorageData: sessionDomainToStorageData,
  fromStorageData: sessionStorageDataToDomain,
  // Backward compatibility
  toStorageFormat: sessionToStorageFormat,
  fromStorageFormat: sessionFromStorageFormat,
};
