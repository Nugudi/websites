import { SESSION_COOKIE_MAX_AGE } from "./constants/session";
import { AuthClient } from "./utils/auth-client";

const internalAuthSecret = process.env.INTERNAL_AUTH_SECRET;
if (!internalAuthSecret) {
  throw new Error("INTERNAL_AUTH_SECRET environment variable must be set");
}

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
