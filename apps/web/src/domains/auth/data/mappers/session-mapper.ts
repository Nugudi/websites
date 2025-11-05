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
 * Entity → 저장 가능한 형식으로 변환
 */
export function sessionToStorageFormat(entity: Session): {
  accessToken: string;
  refreshToken: string;
  userId: string;
  expiresAt: string; // ISO string
} {
  return entity.serialize();
}

/**
 * 저장된 형식에서 Entity 복원
 */
export function sessionFromStorageFormat(data: {
  accessToken: string;
  refreshToken: string;
  userId: string;
  expiresAt: string;
}): Session {
  return SessionEntity.deserialize(data);
}

/**
 * Backward compatibility - 기존 코드에서 사용하는 클래스 형태
 */
export const SessionMapper = {
  toDomain: sessionDtoToDomain,
  fromTokenData: tokenDataToSession,
  toStorageFormat: sessionToStorageFormat,
  fromStorageFormat: sessionFromStorageFormat,
};
