/**
 * 세션 및 토큰 관련 상수
 */

/** 세션 쿠키 만료 시간: 7일 (초 단위) */
export const SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

/** Access Token 만료 시간: 1시간 (초 단위) */
export const ACCESS_TOKEN_EXPIRES_IN = 60 * 60;

/** Refresh Token 만료 시간: 7일 (초 단위) */
export const REFRESH_TOKEN_EXPIRES_IN = 60 * 60 * 24 * 7;

/** 토큰 갱신 버퍼: 5분 (초 단위) - Access Token 만료 5분 전부터 갱신 시도 */
export const TOKEN_REFRESH_BUFFER = 5 * 60;
