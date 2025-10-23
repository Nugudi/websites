import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClientContainer } from "@/src/di/auth-client-container";
import { logger } from "@/src/shared/infrastructure/logging/logger";
import { getDeviceId } from "../actions";
import { SOCIAL_SIGN_UP_STORE_KEY } from "../constants/social-sign-up";
import { AuthError } from "../errors/auth-error";
import type { SocialSignUpAgreementSchema } from "../schemas/social-sign-up-schema";
import { useSocialSignUpStore } from "../stores/use-social-sign-up-store";
import { createDeviceInfo } from "../utils/device";

export const useSocialSignUpSubmit = () => {
  const { data, registrationToken, provider } = useSocialSignUpStore();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (agreementData: SocialSignUpAgreementSchema) => {
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

      if (!data.nickname || !registrationToken) {
        throw AuthError.missingRequiredFields([
          "nickname",
          "registrationToken",
        ]);
      }

      const deviceId = await getDeviceId();
      const deviceInfo = createDeviceInfo(navigator.userAgent, deviceId);

      const authService = authClientContainer.getAuthService();

      const signUpResult = await authService.signUpWithSocial(
        registrationToken,
        {
          nickname: data.nickname,
          privacyPolicy: agreementData.privacyPolicy,
          termsOfService: agreementData.termsOfService,
          locationInfo: agreementData.locationInfo,
          marketingEmail: agreementData.marketingEmail ?? false,
          deviceInfo,
        },
      );

      logger.info("Social sign up successful, setting up session", {
        userId: signUpResult.userId,
        provider,
      });

      const sessionResponse = await fetch("/api/auth/sign-up/social", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: signUpResult.userId,
          nickname: signUpResult.nickname,
          accessToken: signUpResult.accessToken,
          refreshToken: signUpResult.refreshToken,
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

      logger.info("Session setup successful, redirecting to home", {
        userId: signUpResult.userId,
      });

      localStorage.removeItem(SOCIAL_SIGN_UP_STORE_KEY);
      router.push("/");
    } catch (error) {
      if (error instanceof AuthError) {
        logger.error("Social sign up failed", {
          error: error.toJSON(),
        });
        alert(`회원가입 중 오류가 발생했습니다: ${error.message}`);
      } else {
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
