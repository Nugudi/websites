// 약관 항목 타입
export interface TermsAgreement {
  id: number;
  title: string;
  link: string;
  mandatory: boolean;
}

// 약관 동의 상태를 저장하는 객체 타입
export interface TermsAgreementState {
  [key: string]: boolean;
}

// 약관 컴포넌트 Props 타입
export interface TermsComponentProps {
  agreements: TermsAgreementState;
  onAgreementChange: (termId: string, checked: boolean) => void;
  onAllAgreementChange: (checked: boolean) => void;
}

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
