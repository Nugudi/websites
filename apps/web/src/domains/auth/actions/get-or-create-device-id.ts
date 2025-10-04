"use server";

import { cookies } from "next/headers";

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
