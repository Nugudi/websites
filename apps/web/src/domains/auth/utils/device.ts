import type { UserDeviceInfoDTO } from "@nugudi/api/schemas";
import type { NextRequest } from "next/server";
import { UAParser } from "ua-parser-js";

/**
 * User Agent를 파싱하여 디바이스 정보 생성
 *
 * @param userAgent - User Agent 문자열
 * @param deviceId - Device ID (서버에서 관리되는 고유 식별자)
 * @param request - (Optional) NextRequest 객체 (서버 사이드에서만 사용)
 *
 * @example
 * ```tsx
 * // 클라이언트에서 사용 (Server Action으로 deviceId 가져오기)
 * const deviceId = await getOrCreateDeviceId();
 * const deviceInfo = createDeviceInfo(navigator.userAgent, deviceId);
 * ```
 *
 * @example
 * ```tsx
 * // 서버에서 사용 (OAuth Provider 등)
 * const deviceId = request.cookies.get("x-device-id")?.value || crypto.randomUUID();
 * const deviceInfo = createDeviceInfo(userAgent, deviceId, request);
 * ```
 */
export const createDeviceInfo = (
  userAgent: string,
  deviceId: string,
  _request?: NextRequest,
): UserDeviceInfoDTO => {
  const parser = new UAParser(userAgent);
  const device = parser.getDevice();
  const os = parser.getOS();

  let deviceType: UserDeviceInfoDTO["deviceType"] = "WEB";
  if (os.name === "iOS") {
    deviceType = "IOS";
  } else if (os.name === "Android") {
    deviceType = "ANDROID";
  }

  return {
    deviceType,
    deviceUniqueId: deviceId,
    deviceName:
      device.model || device.vendor || `${os.name || "Unknown"} Device`,
    deviceModel: device.model || "Unknown",
    osVersion: os.version || "Unknown",
    appVersion: "1.0.0",
    pushToken: "",
  };
};
