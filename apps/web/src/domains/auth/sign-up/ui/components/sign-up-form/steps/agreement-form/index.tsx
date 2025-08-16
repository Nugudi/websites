"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nugudi/react-components-button";
import { Body, Box, Heading } from "@nugudi/react-components-layout";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { 약관목록 } from "@/src/domains/auth/sign-up/constants/sign-up";
import {
  type SignUpAgreementSchema,
  signUpAgreementSchema,
} from "@/src/domains/auth/sign-up/schemas/sign-up-schema";
import { useSignUpStore } from "@/src/domains/auth/sign-up/stores/use-sign-up-store";
import type { TermsAgreements } from "@/src/domains/auth/sign-up/types/sign-up";
import Terms from "@/src/domains/auth/sign-up/ui/components/sign-up-form/steps/agreement-form/terms";
import * as styles from "./index.css";

const AgreementForm = () => {
  const { setData, resetAll } = useSignUpStore();
  const router = useRouter();

  const [termsAgreements, setTermsAgreements] = useState<TermsAgreements>(
    () => {
      return 약관목록.reduce<TermsAgreements>(
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

  const 필수약관동의여부 = useMemo(() => {
    const 필수약관 = 약관목록.filter((term) => term.mandatory);
    return 필수약관.every((term) => termsAgreements[String(term.id)]);
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
        disabled={!필수약관동의여부}
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

export default AgreementForm;
