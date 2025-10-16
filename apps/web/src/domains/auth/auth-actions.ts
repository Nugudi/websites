"use server";

import { auth } from "./auth-server";
import type { ClientSession } from "./types";

/**
 * 클라이언트용 세션 조회 (Server Action)
 *
 * Client Component에서 세션 정보를 가져올 때 사용합니다.
 * Middleware에서 이미 토큰 갱신을 처리하므로 refresh: false로 설정됩니다.
 *
 * @returns ClientSession | null
 *
 * @example
 * ```tsx
 * "use client";
 *
 * const session = await getClientSession();
 * console.log(session?.accessToken);
 * ```
 */
export async function getClientSession(): Promise<ClientSession | null> {
  return await auth.getClientSession();
}

/**
 * Server-Side에서 Device ID를 가져오거나 생성합니다.
 * httpOnly 쿠키로 저장하여 클라이언트에서 접근할 수 없도록 보안을 유지합니다.
 *
 * @returns deviceId - 기존에 저장된 Device ID 또는 새로 생성된 UUID
 *
 * @example
 * ```tsx
 * const deviceId = await getOrCreateDeviceId();
 * ```
 */
export async function getOrCreateDeviceId(): Promise<string> {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  let deviceId = cookieStore.get("x-device-id")?.value;

  if (!deviceId) {
    deviceId = crypto.randomUUID();
    cookieStore.set("x-device-id", deviceId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1년
    });
  }

  return deviceId;
}
