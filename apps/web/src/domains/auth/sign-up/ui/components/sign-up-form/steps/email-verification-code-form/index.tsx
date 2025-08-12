"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nugudi/react-components-button";
import { InputOTP } from "@nugudi/react-components-input-otp";
import { Box, Title } from "@nugudi/react-components-layout";
import { useForm } from "react-hook-form";
import {
  type SignUpEmailVerificationCodeSchema,
  signUpEmailVerificationCodeSchema,
} from "@/src/domains/auth/sign-up/schemas/sign-up-schema";
import { useSignUpStore } from "@/src/domains/auth/sign-up/stores/use-sign-up-store";
import * as styles from "./index.css";

const EmailVerificationCodeForm = () => {
  const { setStep, setData } = useSignUpStore();

  const form = useForm<SignUpEmailVerificationCodeSchema>({
    resolver: zodResolver(signUpEmailVerificationCodeSchema),
    defaultValues: {
      code: "",
    },
    mode: "onTouched",
  });

  const onSubmit = (data: SignUpEmailVerificationCodeSchema) => {
    setStep(3);
    setData({
      ...data,
      code: data.code,
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form}>
      <Box className={styles.titleContainer}>
        <Title fontSize="t1" color="zinc">
          인증 번호를 입력해주세요
        </Title>
      </Box>

      <Box className={styles.inputOtpContainer}>
        <InputOTP
          length={6}
          value={form.watch("code")}
          isError={!!form.formState.errors.code}
          errorMessage={form.formState.errors.code?.message}
          onChange={(value) => {
            form.setValue("code", value);
          }}
        />
      </Box>

      <Button type="submit" color="zinc" variant="brand" size="lg">
        다음
      </Button>
    </form>
  );
};

export default EmailVerificationCodeForm;
