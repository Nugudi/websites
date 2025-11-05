"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nugudi/react-components-button";
import { InputOTP } from "@nugudi/react-components-input-otp";
import { Box, HStack, Title } from "@nugudi/react-components-layout";
import { useForm } from "react-hook-form";
import {
  type SignUpEmailVerificationCodeSchema,
  signUpEmailVerificationCodeSchema,
} from "../../../../schemas/sign-up-schema";
import { useSignUpStore } from "../../../../stores/use-sign-up-store";
import * as styles from "./index.css";

export const EmailVerificationCodeForm = () => {
  const { setStep, setData, data } = useSignUpStore();

  const form = useForm<SignUpEmailVerificationCodeSchema>({
    resolver: zodResolver(signUpEmailVerificationCodeSchema),
    defaultValues: {
      code: data.code ?? "",
    },
    mode: "onTouched",
  });

  const onPrevious = () => {
    setStep(1);
  };

  const onNext = (data: SignUpEmailVerificationCodeSchema) => {
    setStep(3);
    setData({
      ...data,
      code: data.code,
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onNext)} className={styles.form}>
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

      <HStack gap={20}>
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
          type="submit"
          color="zinc"
          variant="brand"
          size="lg"
          width="full"
        >
          다음
        </Button>
      </HStack>
    </form>
  );
};
