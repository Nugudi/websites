// Re-export terms types
export type {
  TermsAgreement,
  TermsAgreementState,
  TermsComponentProps,
} from "./terms";

// 디바이스 정보 타입
export interface DeviceInfo {
  deviceType: "IOS" | "ANDROID" | "WEB";
  deviceUniqueId: string;
  deviceName: string;
  deviceModel: string;
  osVersion: string;
  appVersion: string;
  pushToken: string;
}
