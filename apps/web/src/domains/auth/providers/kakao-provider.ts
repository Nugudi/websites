import { getKakaoAuthorizeUrl, kakaoLogin } from "@nugudi/api";
import type { createDeviceInfo } from "../utils/device";
import { BaseOAuthProvider } from "./base-oauth-provider";

export class KakaoProvider extends BaseOAuthProvider {
  readonly type = "kakao" as const;

  protected async fetchAuthorizeUrl(redirectUri: string) {
    return getKakaoAuthorizeUrl({ redirectUri });
  }

  protected async fetchLogin(params: {
    code: string;
    redirectUri: string;
    deviceInfo: ReturnType<typeof createDeviceInfo>;
  }) {
    return kakaoLogin(params);
  }
}
