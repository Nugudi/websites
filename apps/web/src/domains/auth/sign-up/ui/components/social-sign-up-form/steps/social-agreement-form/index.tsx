"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSocial } from "@nugudi/api";
import { Button } from "@nugudi/react-components-button";
import { Body, Box, Heading } from "@nugudi/react-components-layout";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { TERMS_AND_CONDITIONS_LIST } from "../../../../../constants/sign-up";
import {
  type SocialSignUpSchema,
  socialSignUpSchema,
} from "../../../../../schemas/social-sign-up-schema";
import { useSocialSignUpStore } from "../../../../../stores/use-social-sign-up-store";
import type { TermsAgreementState } from "../../../../../types/sign-up";
import * as styles from "./index.css";
import { Terms } from "./terms";

export const SocialAgreementForm = () => {
  const { registrationToken, data, resetAll } = useSocialSignUpStore();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [termsAgreements, setTermsAgreements] = useState<TermsAgreementState>(
    () => {
      return TERMS_AND_CONDITIONS_LIST.reduce<TermsAgreementState>(
        (prev, term) => ({
          // biome-ignore lint/performance/noAccumulatingSpread: 임시
          ...prev,
          [term.id]: false,
        }),
        {},
      );
    },
  );

  const form = useForm<SocialSignUpSchema>({
    resolver: zodResolver(socialSignUpSchema),
    defaultValues: {
      nickname: data.nickname || "",
      privacyPolicy: false,
      termsOfService: false,
      locationInfo: false,
      marketingEmail: false,
    },
    mode: "onTouched",
  });

  const termIdToFormFieldMap = useMemo(
    () => ({
      "1": "privacyPolicy",
      "2": "termsOfService",
      "3": "locationInfo",
      "4": "marketingEmail",
    }),
    [],
  );

  const handleTermAgreementChange = useCallback(
    (termId: string, checked: boolean) => {
      setTermsAgreements((prev) => ({
        ...prev,
        [termId]: checked,
      }));

      const formField =
        termIdToFormFieldMap[termId as keyof typeof termIdToFormFieldMap];
      if (formField) {
        form.setValue(formField as keyof SocialSignUpSchema, checked, {
          shouldValidate: true,
        });
      }
    },
    [form, termIdToFormFieldMap],
  );

  const handleAllAgreementChange = useCallback(
    (checked: boolean) => {
      const newAgreements = Object.keys(termsAgreements).reduce(
        (prev, key) => ({
          // biome-ignore lint/performance/noAccumulatingSpread: 임시
          ...prev,
          [key]: checked,
        }),
        {},
      );
      setTermsAgreements(newAgreements);

      form.setValue("privacyPolicy", checked, { shouldValidate: true });
      form.setValue("termsOfService", checked, { shouldValidate: true });
      form.setValue("locationInfo", checked, { shouldValidate: true });
      form.setValue("marketingEmail", checked, { shouldValidate: true });
    },
    [termsAgreements, form],
  );

  const isMandatoryTermsAgreed = useMemo(() => {
    const mandatoryTerms = TERMS_AND_CONDITIONS_LIST.filter(
      (term) => term.mandatory,
    );
    return mandatoryTerms.every((term) => termsAgreements[String(term.id)]);
  }, [termsAgreements]);

  const onSubmit = async (formData: SocialSignUpSchema) => {
    if (!registrationToken) {
      console.error("No registration token found");
      return;
    }

    setIsSubmitting(true);

    try {
      const deviceId = `web-${crypto.randomUUID()}`;

      const response = await signUpSocial(
        {
          nickname: formData.nickname,
          privacyPolicy: formData.privacyPolicy,
          termsOfService: formData.termsOfService,
          locationInfo: formData.locationInfo,
          marketingEmail: formData.marketingEmail || false,
          deviceInfo: {
            deviceType: "WEB",
            deviceUniqueId: deviceId,
            deviceName:
              typeof navigator !== "undefined"
                ? navigator.userAgent
                : "Unknown",
          },
        },
        {
          headers: {
            "X-Registration-Token": registrationToken,
          },
        },
      );

      console.log("[SocialSignUp] Success:", response);

      // 세션 생성 및 홈으로 리다이렉트
      resetAll();
      router.push("/");
    } catch (error) {
      console.error("[SocialSignUp] Error:", error);
      alert("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={form.handleSubmit(onSubmit)}>
      <Box className={styles.titleContainer}>
        <Heading fontSize="h1" color="zinc">
          이용약관 동의가 필요해요
        </Heading>
        <Box className={styles.descriptionContainer}>
          <Body fontSize="b3" color="zinc">
            서비스 이용을 위해
          </Body>
          <Body fontSize="b3" color="zinc">
            필수항목 및 선택항목 약관에 동의해주세요
          </Body>
        </Box>
      </Box>

      <Box className={styles.agreementContainer}>
        <Terms
          agreements={termsAgreements}
          onAgreementChange={handleTermAgreementChange}
          onAllAgreementChange={handleAllAgreementChange}
        />
      </Box>

      <Button
        disabled={!isMandatoryTermsAgreed || isSubmitting}
        type="submit"
        color="main"
        variant="brand"
        size="lg"
        className={styles.submitButton}
      >
        {isSubmitting ? "완료 중..." : "완료"}
      </Button>
    </form>
  );
};
