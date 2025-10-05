import { signUpSocial } from "@nugudi/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { logger } from "@/src/shared/utils/logger";
import { getOrCreateDeviceId } from "../actions/get-or-create-device-id";
import { SOCIAL_SIGN_UP_STORE_KEY } from "../constants/social-sign-up";
import { AuthError } from "../errors/auth-error";
import type { SocialSignUpAgreementSchema } from "../schemas/social-sign-up-schema";
import { useSocialSignUpStore } from "../stores/use-social-sign-up-store";
import { createDeviceInfo } from "../utils/device";

/**
 * 소셜 회원가입 제출 로직을 처리하는 커스텀 훅
 *
 * @returns 회원가입 제출 함수와 상태
 *
 * @example
 * ```tsx
 * const { onSubmit, isSubmitting } = useSocialSignUpSubmit();
 *
 * await onSubmit({
 *   privacyPolicy: true,
 *   termsOfService: true,
 *   locationInfo: true,
 *   marketingEmail: false,
 * });
 * ```
 */
export const useSocialSignUpSubmit = () => {
  const { data, registrationToken, provider, resetAll } =
    useSocialSignUpStore();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (agreementData: SocialSignUpAgreementSchema) => {
    // 필수 필드 검증
    const missingFields: string[] = [];
    if (!registrationToken) missingFields.push("registrationToken");
    if (!data.nickname) missingFields.push("nickname");

    if (missingFields.length > 0) {
      const error = AuthError.missingRequiredFields(missingFields);
      logger.error("Social sign up validation failed", {
        error: error.toJSON(),
      });
      alert("필수 정보가 누락되었습니다. 처음부터 다시 시도해주세요.");
      router.push("/auth/sign-in");
      return;
    }

    setIsSubmitting(true);

    try {
      logger.info("Starting social sign up", {
        provider,
        nickname: data.nickname,
      });

      if (!data.nickname) {
        throw AuthError.missingRequiredFields(["nickname"]);
      }

      if (!registrationToken) {
        throw AuthError.missingRequiredFields(["registrationToken"]);
      }

      // 1. Device ID를 Server Action을 통해 가져오기 (httpOnly 쿠키에서 안전하게 관리)
      const deviceId = await getOrCreateDeviceId();
      const deviceInfo = createDeviceInfo(navigator.userAgent, deviceId);

      // 2. 소셜 회원가입 API 호출
      const response = await signUpSocial(
        {
          nickname: data.nickname,
          privacyPolicy: agreementData.privacyPolicy,
          termsOfService: agreementData.termsOfService,
          locationInfo: agreementData.locationInfo,
          marketingEmail: agreementData.marketingEmail ?? false,
          deviceInfo,
        },
        {
          headers: {
            "X-Registration-Token": registrationToken,
          },
        },
      );

      if (response.status !== 201 || !response.data.success) {
        throw AuthError.signupFailed("API returned unsuccessful response", {
          status: response.status,
        });
      }

      const signUpData = response.data.data;

      // 2. 응답 데이터 검증
      if (
        !signUpData?.userId ||
        !signUpData?.nickname ||
        !signUpData?.accessToken ||
        !signUpData?.refreshToken
      ) {
        throw AuthError.invalidSignupData(
          "Missing required fields in response",
        );
      }

      logger.info("Social sign up successful, setting up session", {
        userId: signUpData.userId,
        provider,
      });

      // 3. 세션 설정을 위해 내부 API 호출
      // deviceId는 서버에서 쿠키를 통해 재사용하되, 클라이언트에서 생성한 ID도 전달
      const sessionResponse = await fetch("/api/auth/sign-up/social", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: signUpData.userId,
          nickname: signUpData.nickname,
          accessToken: signUpData.accessToken,
          refreshToken: signUpData.refreshToken,
          deviceId: deviceInfo.deviceUniqueId,
          provider: provider,
        }),
      });

      if (!sessionResponse.ok) {
        const errorText = await sessionResponse.text();
        throw AuthError.sessionSetupFailed(
          `HTTP ${sessionResponse.status}: ${errorText}`,
        );
      }

      // 4. 세션 설정 완료 후 홈으로 이동
      logger.info("Session setup successful, redirecting to home", {
        userId: signUpData.userId,
      });

      // localStorage 정리 후 페이지 이동
      localStorage.removeItem(SOCIAL_SIGN_UP_STORE_KEY);
      router.push("/");
    } catch (error) {
      // AuthError 타입의 에러는 구조화된 로깅
      if (error instanceof AuthError) {
        logger.error("Social sign up failed", {
          error: error.toJSON(),
        });
        alert(`회원가입 중 오류가 발생했습니다: ${error.message}`);
      } else {
        // 예상치 못한 에러
        const unknownError = AuthError.unknown(
          error instanceof Error ? error.message : String(error),
          { originalError: error },
        );
        logger.error("Unexpected error during social sign up", {
          error: unknownError.toJSON(),
        });
        alert("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    onSubmit,
    isSubmitting,
  };
};
