import "server-only";

import { SESSION_COOKIE_MAX_AGE } from "./constants/session";
import { AuthClient } from "./utils/auth-client";

const internalAuthSecret = process.env.INTERNAL_AUTH_SECRET;
if (!internalAuthSecret) {
  throw new Error("INTERNAL_AUTH_SECRET environment variable must be set");
}

/**
 * AuthClient 인스턴스 (Server-only)
 *
 * IMPORTANT: 이 인스턴스는 서버에서만 사용 가능합니다.
 * Client Component에서 사용하려면 `auth-actions.ts`의 Server Actions를 사용하세요.
 */
export const auth = new AuthClient({
  secret: internalAuthSecret,
  sessionCookieName: "nugudi.session",
  cookieOptions: {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    maxAge: SESSION_COOKIE_MAX_AGE,
  },
});
