/**
 * Social Sign Up Submit Hook
 *
 * Custom hook for handling social OAuth sign-up submission
 */

import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { authClientContainer } from "@/src/di/auth-client-container";
import type { SocialSignUpAgreementSchema } from "../schemas/social-sign-up-schema";
import { useSocialSignUpStore } from "../stores/use-social-sign-up-store";

export function useSocialSignUpSubmit() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { nickname, reset } = useSocialSignUpStore();

  const mutation = useMutation({
    mutationFn: async (data: SocialSignUpAgreementSchema) => {
      const registrationToken = searchParams.get("registrationToken");

      if (!registrationToken) {
        throw new Error("Registration token not found");
      }

      if (!nickname) {
        throw new Error("Nickname is required");
      }

      const authService = await authClientContainer.getAuthService();

      await authService.signUpWithSocial.execute({
        registrationToken,
        userData: {
          nickname,
          privacyPolicy: data.privacyPolicy,
          termsOfService: data.termsOfService,
          locationInfo: data.locationInfo,
          marketingEmail: data.marketingEmail ?? false,
        },
      });
    },
    onSuccess: () => {
      reset();
      router.push("/");
    },
    onError: (error) => {
      console.error("Social sign-up error:", error);
    },
  });

  return {
    onSubmit: (data: SocialSignUpAgreementSchema) => mutation.mutate(data),
    isSubmitting: mutation.isPending,
    error: mutation.error,
  };
}
