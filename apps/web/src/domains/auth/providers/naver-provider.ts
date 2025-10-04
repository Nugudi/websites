import { getNaverAuthorizeUrl, naverLogin } from "@nugudi/api";
import type { createDeviceInfo } from "../utils/device";
import { BaseOAuthProvider } from "./base-oauth-provider";

export class NaverProvider extends BaseOAuthProvider {
  readonly type = "naver" as const;

  protected async fetchAuthorizeUrl(redirectUri: string) {
    return getNaverAuthorizeUrl({ redirectUri });
  }

  protected async fetchLogin(params: {
    code: string;
    redirectUri: string;
    deviceInfo: ReturnType<typeof createDeviceInfo>;
  }) {
    return naverLogin(params);
  }
}
