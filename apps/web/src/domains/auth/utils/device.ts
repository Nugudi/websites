import type { UserDeviceInfoDTO } from "@nugudi/api/schemas";
import type { NextRequest } from "next/server";
import { UAParser } from "ua-parser-js";

/**
 * 브라우저 쿠키에서 특정 값 읽기
 */
const getCookieValue = (name: string): string | undefined => {
  if (typeof document === "undefined") return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return undefined;
};

/**
 * User Agent를 파싱하여 디바이스 정보 생성
 * 쿠키에 저장된 기존 device ID가 있으면 재사용하고, 없으면 새로 생성
 */
export const createDeviceInfo = (
  userAgent: string,
  request?: NextRequest,
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

  // 쿠키에서 기존 device ID 조회
  // 서버: NextRequest에서 쿠키 읽기
  // 클라이언트: document.cookie에서 쿠키 읽기
  const existingDeviceId =
    request?.cookies.get("x-device-id")?.value || getCookieValue("x-device-id");
  const deviceUniqueId = existingDeviceId || crypto.randomUUID();

  return {
    deviceType,
    deviceUniqueId,
    deviceName:
      device.model || device.vendor || `${os.name || "Unknown"} Device`,
    deviceModel: device.model || "Unknown",
    osVersion: os.version || "Unknown",
    appVersion: "1.0.0",
    pushToken: "",
  };
};
