import type { UserDeviceInfoDTO } from "@nugudi/api/schemas";
import { UAParser } from "ua-parser-js";

/**
 * User Agent를 파싱하여 디바이스 정보 생성
 */
export const createDeviceInfo = (userAgent: string): UserDeviceInfoDTO => {
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
    deviceUniqueId: crypto.randomUUID(),
    deviceName:
      device.model || device.vendor || `${os.name || "Unknown"} Device`,
    deviceModel: device.model || "Unknown",
    osVersion: os.version || "Unknown",
    appVersion: "1.0.0",
    pushToken: "",
  };
};
