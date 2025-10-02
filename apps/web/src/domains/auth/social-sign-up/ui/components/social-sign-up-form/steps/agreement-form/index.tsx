"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSocial } from "@nugudi/api";
import type { UserDeviceInfoDTO } from "@nugudi/api/schemas";
import { Button } from "@nugudi/react-components-button";
import { Body, Box, Heading } from "@nugudi/react-components-layout";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { UAParser } from "ua-parser-js";
import { SOCIAL_TERMS_LIST } from "../../../../../constants/social-sign-up";
import {
  type SocialSignUpAgreementSchema,
  socialSignUpAgreementSchema,
} from "../../../../../schemas/social-sign-up-schema";
import { useSocialSignUpStore } from "../../../../../stores/use-social-sign-up-store";
import type { TermsAgreementState } from "../../../../../types/social-sign-up";
import * as styles from "./index.css";
import { SocialTerms } from "./terms";

export const AgreementForm = () => {
  const { data, registrationToken, resetAll } = useSocialSignUpStore();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [termsAgreements, setTermsAgreements] = useState<TermsAgreementState>(
    () => {
      return SOCIAL_TERMS_LIST.reduce<TermsAgreementState>(
        (prev, term) => ({
          // biome-ignore lint/performance/noAccumulatingSpread: 임시
          ...prev,
          [term.id]: false,
        }),
        {},
      );
    },
  );

  const form = useForm<SocialSignUpAgreementSchema>({
    resolver: zodResolver(socialSignUpAgreementSchema),
    defaultValues: {
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
        form.setValue(formField as keyof SocialSignUpAgreementSchema, checked, {
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
    const mandatoryTerms = SOCIAL_TERMS_LIST.filter((term) => term.mandatory);
    return mandatoryTerms.every((term) => termsAgreements[String(term.id)]);
  }, [termsAgreements]);

  const createDeviceInfo = (): UserDeviceInfoDTO => {
    const parser = new UAParser(navigator.userAgent);
    const device = parser.getDevice();
    const os = parser.getOS();
    const browser = parser.getBrowser();

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
      deviceModel: browser.name || "Unknown Browser",
      osVersion: os.version || "Unknown",
      appVersion: "1.0.0",
      pushToken: "",
    };
  };

  const onSubmit = async (agreementData: SocialSignUpAgreementSchema) => {
    if (!registrationToken || !data.nickname) {
      alert("필수 정보가 누락되었습니다. 처음부터 다시 시도해주세요.");
      router.push("/auth/sign-in");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await signUpSocial(
        {
          nickname: data.nickname,
          privacyPolicy: agreementData.privacyPolicy,
          termsOfService: agreementData.termsOfService,
          locationInfo: agreementData.locationInfo,
          marketingEmail: agreementData.marketingEmail ?? false,
          deviceInfo: createDeviceInfo(),
        },
        {
          headers: {
            "X-Registration-Token": registrationToken,
          },
        },
      );

      if (response.status === 201 && response.data.success) {
        resetAll();
        router.push("/");
      } else {
        throw new Error("회원가입에 실패했습니다.");
      }
    } catch (error) {
      console.error("Social signup error:", error);
      alert("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onPrevious = () => {
    const { setStep } = useSocialSignUpStore.getState();
    setStep(1);
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
        <SocialTerms
          agreements={termsAgreements}
          onAgreementChange={handleTermAgreementChange}
          onAllAgreementChange={handleAllAgreementChange}
        />
      </Box>

      <Box className={styles.buttonContainer}>
        <Button
          type="button"
          color="zinc"
          variant="neutral"
          size="lg"
          onClick={onPrevious}
          width="full"
        >
          이전
        </Button>
        <Button
          disabled={!isMandatoryTermsAgreed || isSubmitting}
          type="submit"
          color="main"
          variant="brand"
          size="lg"
          width="full"
        >
          {isSubmitting ? "처리 중..." : "완료"}
        </Button>
      </Box>
    </form>
  );
};
