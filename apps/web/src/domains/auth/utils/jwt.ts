import { decodeJwt } from "jose";
import { TOKEN_REFRESH_BUFFER } from "../constants/session";

export const isTokenExpired = (
  token: string,
  buffer = TOKEN_REFRESH_BUFFER,
) => {
  try {
    const payload = decodeJwt(token);
    if (!payload.exp) {
      return false;
    }

    const currentTime = Math.floor(Date.now() / 1_000);
    const expirationTime = (payload.exp as number) - buffer;

    return currentTime >= expirationTime;
  } catch {
    return true;
  }
};
