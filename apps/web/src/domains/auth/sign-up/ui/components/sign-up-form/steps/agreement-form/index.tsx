"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nugudi/react-components-button";
import { Body, Box, Heading } from "@nugudi/react-components-layout";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  type SignUpAgreementSchema,
  signUpAgreementSchema,
} from "@/src/domains/auth/sign-up/schemas/sign-up-schema";
import { useSignUpStore } from "@/src/domains/auth/sign-up/stores/use-sign-up-store";
import * as styles from "./index.css";

const AgreementForm = () => {
  const { setData, resetAll } = useSignUpStore();
  const router = useRouter();
  const [agreements, setAgreements] = useState({
    all: false,
    privacy: false,
    terms: false,
    marketing: false,
  });

  const form = useForm<SignUpAgreementSchema>({
    resolver: zodResolver(signUpAgreementSchema),
    defaultValues: {
      acceptPrivacyPolicy: false,
      acceptTermsOfService: false,
      acceptMarketingEmail: false,
    },
    mode: "onTouched",
  });

  const handleAgreementChange = (type: string, checked: boolean) => {
    if (type === "all") {
      const newAgreements = {
        all: checked,
        privacy: checked,
        terms: checked,
        marketing: checked,
      };
      setAgreements(newAgreements);
      form.setValue("acceptPrivacyPolicy", checked);
      form.setValue("acceptTermsOfService", checked);
      form.setValue("acceptMarketingEmail", checked);
    } else {
      const newAgreements = {
        ...agreements,
        [type]: checked,
      };
      const allChecked =
        newAgreements.privacy && newAgreements.terms && newAgreements.marketing;
      newAgreements.all = allChecked;
      setAgreements(newAgreements);

      if (type === "privacy") form.setValue("acceptPrivacyPolicy", checked);
      if (type === "terms") form.setValue("acceptTermsOfService", checked);
      if (type === "marketing") form.setValue("acceptMarketingEmail", checked);
    }
  };

  const onSubmit = (data: SignUpAgreementSchema) => {
    setData({
      ...data,
      acceptPrivacyPolicy: data.acceptPrivacyPolicy,
      acceptTermsOfService: data.acceptTermsOfService,
      acceptMarketingEmail: data.acceptMarketingEmail,
    });
    resetAll();
    router.push("/");
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
        <Box className={styles.agreementItem}>
          <label className={styles.agreementLabel}>
            <input
              type="checkbox"
              checked={agreements.all}
              onChange={(e) => handleAgreementChange("all", e.target.checked)}
              className={styles.checkbox}
            />
            <span className={styles.checkmark} />
            <span className={styles.agreementText}>약관 전체 동의</span>
          </label>
        </Box>

        <Box className={styles.agreementItem}>
          <label className={styles.agreementLabel}>
            <input
              type="checkbox"
              checked={agreements.privacy}
              onChange={(e) =>
                handleAgreementChange("privacy", e.target.checked)
              }
              className={styles.checkbox}
            />
            <span className={styles.checkmark} />
            <span className={styles.agreementText}>
              [필수] 개인정보 처리 방침
            </span>
          </label>
          <button type="button" className={styles.arrowButton}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              aria-label="arrow"
            >
              <title>상세보기</title>
              <path
                d="M7.5 15L12.5 10L7.5 5"
                stroke="#999"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </Box>

        <Box className={styles.agreementItem}>
          <label className={styles.agreementLabel}>
            <input
              type="checkbox"
              checked={agreements.terms}
              onChange={(e) => handleAgreementChange("terms", e.target.checked)}
              className={styles.checkbox}
            />
            <span
              className={`${styles.checkmark} ${agreements.terms ? styles.checked : ""}`}
            />
            <span className={styles.agreementText}>[필수] 이용 약관 동의</span>
          </label>
          <button type="button" className={styles.arrowButton}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              aria-label="arrow"
            >
              <title>상세보기</title>
              <path
                d="M7.5 15L12.5 10L7.5 5"
                stroke="#999"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </Box>

        <Box className={styles.agreementItem}>
          <label className={styles.agreementLabel}>
            <input
              type="checkbox"
              checked={agreements.marketing}
              onChange={(e) =>
                handleAgreementChange("marketing", e.target.checked)
              }
              className={styles.checkbox}
            />
            <span className={styles.checkmark} />
            <span className={styles.agreementText}>
              (선택) 마케팅 이메일 수신 동의
            </span>
          </label>
          <button type="button" className={styles.arrowButton}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              aria-label="상세보기"
            >
              <title>상세보기</title>
              <path
                d="M7.5 15L12.5 10L7.5 5"
                stroke="#999"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </Box>
      </Box>

      <Button
        disabled={!agreements.privacy || !agreements.terms}
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
