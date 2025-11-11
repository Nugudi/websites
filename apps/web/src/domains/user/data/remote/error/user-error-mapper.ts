/**
 * User Error Mapper
 *
 * Data Layer의 HTTP Error → Domain Error 변환
 *
 * @remarks
 * - HTTP 상태 코드를 Domain 비즈니스 에러로 매핑
 * - Clean Architecture: Infrastructure 관심사를 Domain으로 변환
 */

import type { HttpError } from "@core/infrastructure/http/fetch-http-client";
import { USER_ERROR_CODES, UserError } from "../../../domain/errors/user-error";

/**
 * HTTP 에러를 UserError로 변환
 *
 * @param error - HTTP 에러 객체
 * @returns Domain UserError
 *
 * @remarks
 * HTTP 에러를 Domain 에러로 변환하는 Data Layer 책임
 */
export function fromHttpError(error: HttpError): UserError {
  const statusCode = error.status;

  // 401 Unauthorized - 인증 실패
  if (statusCode === 401) {
    return new UserError(
      "인증이 필요합니다. 다시 로그인해주세요.",
      USER_ERROR_CODES.AUTHENTICATION_REQUIRED,
      error,
    );
  }

  // 403 Forbidden - 권한 없음
  if (statusCode === 403) {
    return new UserError(
      "접근 권한이 없습니다.",
      USER_ERROR_CODES.UNAUTHORIZED_ACCESS,
      error,
    );
  }

  // 404 Not Found - 사용자 프로필 없음
  if (statusCode === 404) {
    return new UserError(
      "사용자 프로필을 찾을 수 없습니다.",
      USER_ERROR_CODES.PROFILE_NOT_FOUND,
      error,
    );
  }

  // 409 Conflict - 닉네임 중복
  if (statusCode === 409) {
    return new UserError(
      "이미 사용 중인 닉네임입니다.",
      USER_ERROR_CODES.NICKNAME_ALREADY_EXISTS,
      error,
    );
  }

  // 422 Unprocessable Entity - 유효하지 않은 데이터
  if (statusCode === 422) {
    return new UserError(
      "유효하지 않은 데이터입니다.",
      USER_ERROR_CODES.INVALID_USER_DATA,
      error,
    );
  }

  // 500+ Server Error - 서버 오류
  if (statusCode >= 500) {
    return new UserError(
      "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      USER_ERROR_CODES.SERVER_ERROR,
      error,
    );
  }

  // 기타 에러 - 일반 프로필 조회 오류
  return new UserError(
    error.message || "사용자 정보 조회 중 오류가 발생했습니다.",
    USER_ERROR_CODES.PROFILE_FETCH_FAILED,
    error,
  );
}

/**
 * Unknown Error를 UserError로 변환
 *
 * @param error - 알 수 없는 에러
 * @param defaultMessage - 기본 메시지
 * @returns Domain UserError
 */
export function fromUnknownError(
  error: unknown,
  defaultMessage: string,
): UserError {
  // 이미 UserError인 경우 그대로 반환
  if (error instanceof UserError) {
    return error;
  }

  // Error 객체인 경우
  if (error instanceof Error) {
    return new UserError(defaultMessage, USER_ERROR_CODES.SERVER_ERROR, error);
  }

  // 그 외 알 수 없는 에러
  return new UserError(defaultMessage, USER_ERROR_CODES.SERVER_ERROR, error);
}
