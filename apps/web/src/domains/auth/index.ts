import { AuthClient } from "./utils/auth-client";

export const auth = new AuthClient({
  secret: process.env.INTERNAL_AUTH_SECRET || "",
  sessionCookieName: "nugudi.session",
  cookieOptions: {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    maxAge: 60 * 60 * 24 * 7,
  },
});
