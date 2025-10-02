import type { ProviderType } from "./provider";

/**
 * 사용자 정보
 */
export interface User {
  userId: number;
  nickname: string;
  email?: string;
}

/**
 * 토큰 세트 (서버 전용)
 */
export interface TokenSet {
  accessToken: string;
  refreshToken: string;
}

/**
 * 전체 세션 정보 (서버 전용)
 * refresh token 포함
 */
export interface Session {
  user: User;
  tokenSet: TokenSet;
  provider: ProviderType;
}

/**
 * 클라이언트용 세션 정보
 * refresh token 제외
 */
export interface ClientSession {
  user: User;
  accessToken: string;
  provider: ProviderType;
}

/**
 * Session을 ClientSession으로 변환
 */
export function toClientSession(session: Session): ClientSession {
  return {
    user: session.user,
    accessToken: session.tokenSet.accessToken,
    provider: session.provider,
  };
}

/**
 * Access Token 만료 여부 확인
 * @param token JWT 토큰
 * @returns 만료 여부
 */
export function isTokenExpired(token: string): boolean {
  try {
    const [, payload] = token.split(".");
    if (!payload) return true;

    const decoded = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf-8"),
    );
    const exp = decoded.exp;

    if (typeof exp !== "number") return true;

    // 만료 시간 5분 전을 만료로 간주 (갱신 버퍼)
    const bufferTime = 5 * 60;
    return Date.now() >= (exp - bufferTime) * 1000;
  } catch {
    return true;
  }
}
