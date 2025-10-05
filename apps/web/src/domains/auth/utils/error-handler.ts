import { type NextRequest, NextResponse } from "next/server";
import { logger } from "@/src/shared/utils/logger";
import { AuthError } from "../errors/auth-error";

/**
 * 중앙화된 인증 에러 핸들러
 * @param error 에러 객체
 * @param request Next.js request
 * @returns /error 페이지로 리다이렉트 응답
 */
export function handleAuthError(
  error: unknown,
  request: NextRequest,
): NextResponse {
  if (error instanceof AuthError) {
    logger.error(`Authentication error: ${error.code}`, {
      code: error.code,
      message: error.message,
      context: error.context,
    });
  } else {
    logger.error("Unexpected authentication error", {
      error: error instanceof Error ? error.message : String(error),
    });
  }

  return NextResponse.redirect(new URL("/error", request.url));
}
