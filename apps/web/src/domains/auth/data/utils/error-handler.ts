/**
 * Auth Error Handler Utility
 *
 * API Route에서 사용하는 에러 핸들러
 */

import { type NextRequest, NextResponse } from "next/server";
import { AuthError } from "../../core/errors/auth-error";

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
function getStatusFromErrorCode(code?: string): number {
  switch (code) {
    case "INVALID_CODE":
    case "INVALID_TOKEN":
      return 401;
    case "REFRESH_FAILED":
      return 401;
    case "SESSION_NOT_FOUND":
      return 401;
    default:
      return 500;
  }
}
