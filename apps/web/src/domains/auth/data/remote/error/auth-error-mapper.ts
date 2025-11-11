/**
 * Auth Error Mapper
 *
 * Data Layer의 HTTP Error → Domain Error 변환
 *
 * @remarks
 * - HTTP 상태 코드를 Domain 비즈니스 에러로 매핑
 * - Clean Architecture: Infrastructure 관심사를 Domain으로 변환
 */

import type { HttpError } from "@core/infrastructure/http/fetch-http-client";
import { AUTH_ERROR_CODES, AuthError } from "../../../domain/errors/auth-error";

/**
 * HTTP 에러를 AuthError로 변환
 *
 * @param error - HTTP 에러 객체
 * @returns Domain AuthError
 *
 * @remarks
 * HTTP 에러를 Domain 에러로 변환하는 Data Layer 책임
 */
export function fromHttpError(error: HttpError): AuthError {
  const statusCode = error.status;

  // 401 Unauthorized - 인증 실패
  if (statusCode === 401) {
    return new AuthError(
      "인증에 실패했습니다. 다시 로그인해주세요.",
      AUTH_ERROR_CODES.AUTHENTICATION_REQUIRED,
      error,
    );
  }

  // 403 Forbidden - 권한 없음
  if (statusCode === 403) {
    return new AuthError(
      "접근 권한이 없습니다.",
      AUTH_ERROR_CODES.UNAUTHORIZED_ACCESS,
      error,
    );
  }

  // 409 Conflict - 중복된 데이터 (닉네임 등)
  if (statusCode === 409) {
    return new AuthError(
      "이미 사용 중인 정보입니다.",
      AUTH_ERROR_CODES.DUPLICATE_NICKNAME,
      error,
    );
  }

  // 422 Unprocessable Entity - 유효하지 않은 데이터
  if (statusCode === 422) {
    return new AuthError(
      "유효하지 않은 데이터입니다.",
      AUTH_ERROR_CODES.INVALID_USER_DATA,
      error,
    );
  }

  // 500+ Server Error - 서버 오류
  if (statusCode >= 500) {
    return new AuthError(
      "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      AUTH_ERROR_CODES.AUTHENTICATION_REQUIRED,
      error,
    );
  }

  // 기타 에러 - 일반 인증 오류
  return new AuthError(
    error.message || "요청 처리 중 오류가 발생했습니다.",
    AUTH_ERROR_CODES.INVALID_CREDENTIALS,
    error,
  );
}

/**
 * Unknown Error를 AuthError로 변환
 *
 * @param error - 알 수 없는 에러
 * @param defaultMessage - 기본 메시지
 * @returns Domain AuthError
 */
export function fromUnknownError(
  error: unknown,
  defaultMessage: string,
): AuthError {
  // 이미 AuthError인 경우 그대로 반환
  if (error instanceof AuthError) {
    return error;
  }

  // Error 객체인 경우
  if (error instanceof Error) {
    return new AuthError(
      defaultMessage,
      AUTH_ERROR_CODES.INVALID_CREDENTIALS,
      error,
    );
  }

  // 그 외 알 수 없는 에러
  return new AuthError(
    defaultMessage,
    AUTH_ERROR_CODES.INVALID_CREDENTIALS,
    error,
  );
}
