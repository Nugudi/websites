import type { cookies } from "next/headers";
import type { NextRequest } from "next/server";

// Re-export OAuth and login related types from @nugudi/api
export type {
  KakaoLoginRequest,
  KakaoLoginResponse,
  KakaoLoginResponseStatus,
  LocalLoginResponse,
  RefreshTokenResponse,
  SignUpLocalRequest,
  SignUpResponse,
  SignUpSocialRequest,
  SuccessResponseKakaoLoginResponse,
  SuccessResponseLocalLoginResponse,
  SuccessResponseRefreshTokenResponse,
  SuccessResponseSignUpResponse,
  UserDeviceInfoDTO,
  UserDeviceInfoDTODeviceType,
} from "@nugudi/api/schemas";

/**
 * Authentication configuration
 */
export interface AuthConfig {
  secret: string;
  sessionCookieName: string;
  cookieOptions: CookieOptions;
  authorize: (request: NextRequest) => Promise<string | null>;
  callback: (request: NextRequest) => Promise<SessionData | null>;
}

/**
 * Authentication error
 */
export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

/**
 * Cookie options type
 */
export interface CookieOptions
  extends NonNullable<
    Parameters<Awaited<ReturnType<typeof cookies>>["set"]>[2]
  > {}

/**
 * Session data stored in cookies
 */
export interface SessionData {
  user: {
    userId: number;
    nickname: string;
    email?: string;
    profileImageUrl?: string;
  };
  tokenSet: {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresAt?: Date;
    refreshTokenExpiresAt?: Date;
  };
  deviceId: string; // Required for token refresh
}

/**
 * Registration session data for social login
 * Used when a new user completes social login and needs to complete signup
 */
export interface RegistrationSessionData {
  registrationToken: string;
  registrationTokenExpiresAt?: Date;
}
