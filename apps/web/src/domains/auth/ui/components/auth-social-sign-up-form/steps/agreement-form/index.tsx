"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nugudi/react-components-button";
import { Body, Box, Heading } from "@nugudi/react-components-layout";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { SOCIAL_TERMS_LIST } from "../../../../constants/social-sign-up";
import { useSocialSignUpSubmit } from "../../../../hooks/use-social-sign-up-submit";
import {
  type SocialSignUpAgreementSchema,
  socialSignUpAgreementSchema,
} from "../../../../schemas/social-sign-up-schema";
import { useSocialSignUpStore } from "../../../../stores/use-social-sign-up-store";
import type { TermsAgreementState } from "../../../../types/social-sign-up";
import * as styles from "./index.css";
import { SocialTerms } from "./terms";

export const AgreementForm = () => {
  const { onSubmit: handleSubmit, isSubmitting } = useSocialSignUpSubmit();

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

  const onPrevious = () => {
    const { setStep } = useSocialSignUpStore.getState();
    setStep(1);
  };

  return (
    <form className={styles.form} onSubmit={form.handleSubmit(handleSubmit)}>
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
