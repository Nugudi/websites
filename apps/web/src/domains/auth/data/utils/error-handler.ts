/**
 * Auth Error Handler Utility
 *
 * API Route에서 사용하는 에러 핸들러
 */

import { type NextRequest, NextResponse } from "next/server";
import { AUTH_ERROR_CODES, AuthError } from "../../domain/errors/auth-error";

/**
 * Auth 에러를 처리하여 적절한 NextResponse 반환
 */
export function handleAuthError(
  error: unknown,
  _request: NextRequest,
): NextResponse {
  console.error("[Auth Error]", error);

  // AuthError인 경우
  if (error instanceof AuthError) {
    const status = getStatusFromErrorCode(error.code);
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
      },
      { status },
    );
  }

  // 일반 Error인 경우
  if (error instanceof Error) {
    return NextResponse.json(
      {
        error: error.message || "Authentication failed",
      },
      { status: 500 },
    );
  }

  // 알 수 없는 에러
  return NextResponse.json(
    {
      error: "Unknown authentication error",
    },
    { status: 500 },
  );
}

/**
 * AuthError 코드를 HTTP 상태 코드로 변환
 */
function getStatusFromErrorCode(code: string): number {
  switch (code) {
    case AUTH_ERROR_CODES.INVALID_CODE:
    case AUTH_ERROR_CODES.INVALID_TOKEN:
    case AUTH_ERROR_CODES.SESSION_EXPIRED:
    case AUTH_ERROR_CODES.AUTHENTICATION_REQUIRED:
      return 401;
    case AUTH_ERROR_CODES.UNAUTHORIZED_ACCESS:
      return 403;
    case AUTH_ERROR_CODES.DUPLICATE_NICKNAME:
      return 409;
    case AUTH_ERROR_CODES.INVALID_CREDENTIALS:
    case AUTH_ERROR_CODES.INVALID_OAUTH_PROVIDER:
    case AUTH_ERROR_CODES.INVALID_USER_DATA:
    case AUTH_ERROR_CODES.INVALID_NICKNAME:
      return 400;
    case AUTH_ERROR_CODES.TOKEN_REFRESH_FAILED:
      return 500;
    default:
      return 500;
  }
}
