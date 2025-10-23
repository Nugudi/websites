import type { components } from "@nugudi/types";
import type { NextRequest } from "next/server";
import { UAParser } from "ua-parser-js";

type UserDeviceInfoDTO = components["schemas"]["UserDeviceInfoDTO"];

const OS_TO_DEVICE_TYPE = {
  iOS: "IOS",
  Android: "ANDROID",
} as const;

const DEFAULT_DEVICE_TYPE = "WEB" as const;

export const mapOsToDeviceType = (osName: string | undefined) => {
  if (!osName) return DEFAULT_DEVICE_TYPE;
  return (
    OS_TO_DEVICE_TYPE[osName as keyof typeof OS_TO_DEVICE_TYPE] ??
    DEFAULT_DEVICE_TYPE
  );
};

export const createDeviceName = (
  device: ReturnType<UAParser["getDevice"]>,
  osName: string | undefined,
) => {
  return device.model || device.vendor || `${osName || "Unknown"} Device`;
};

export const createDeviceInfo = (
  userAgent: string,
  deviceId: string,
  _request?: NextRequest,
): UserDeviceInfoDTO => {
  const parser = new UAParser(userAgent);
  const device = parser.getDevice();
  const os = parser.getOS();

  return {
    deviceType: mapOsToDeviceType(os.name),
    deviceUniqueId: deviceId,
    deviceName: createDeviceName(device, os.name),
    deviceModel: device.model || "Unknown",
    osVersion: os.version || "Unknown",
    appVersion: "1.0.0",
    pushToken: "",
  };
};
