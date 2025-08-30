"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nugudi/react-components-button";
import { Body, Box, Heading } from "@nugudi/react-components-layout";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { TERMS_AND_CONDITIONS_LIST } from "../../../../../constants/sign-up";
import {
  type SignUpAgreementSchema,
  signUpAgreementSchema,
} from "../../../../../schemas/sign-up-schema";
import { useSignUpStore } from "../../../../../stores/use-sign-up-store";
import type { TermsAgreementState } from "../../../../../types/sign-up";
import * as styles from "./index.css";
import { Terms } from "./terms";

export const AgreementForm = () => {
  const { setData, resetAll } = useSignUpStore();
  const router = useRouter();

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

  const form = useForm<SignUpAgreementSchema>({
    resolver: zodResolver(signUpAgreementSchema),
    defaultValues: {
      acceptPrivacyPolicy: false,
      acceptTermsOfService: false,
      acceptMarketingEmail: false,
    },
    mode: "onTouched",
  });

  const termIdToFormFieldMap = useMemo(
    () => ({
      "1": "acceptPrivacyPolicy",
      "2": "acceptTermsOfService",
      "3": "acceptMarketingEmail",
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
        form.setValue(formField as keyof SignUpAgreementSchema, checked, {
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

      form.setValue("acceptPrivacyPolicy", checked, { shouldValidate: true });
      form.setValue("acceptTermsOfService", checked, { shouldValidate: true });
      form.setValue("acceptMarketingEmail", checked, { shouldValidate: true });
    },
    [termsAgreements, form],
  );

  const isMandatoryTermsAgreed = useMemo(() => {
    const mandatoryTerms = TERMS_AND_CONDITIONS_LIST.filter(
      (term) => term.mandatory,
    );
    return mandatoryTerms.every((term) => termsAgreements[String(term.id)]);
  }, [termsAgreements]);

  const onSubmit = (data: SignUpAgreementSchema) => {
    setData(data);
    router.push("/");
    resetAll();
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
        disabled={!isMandatoryTermsAgreed}
        type="submit"
        color="main"
        variant="brand"
        size="lg"
        className={styles.submitButton}
      >
        완료
      </Button>
    </form>
  );
};
