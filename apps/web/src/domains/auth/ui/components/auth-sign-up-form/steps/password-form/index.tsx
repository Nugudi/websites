"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon } from "@nugudi/assets-icons";
import { Button } from "@nugudi/react-components-button";
import { Input } from "@nugudi/react-components-input";
import { Body, Box, HStack, Title } from "@nugudi/react-components-layout";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  type SignUpPasswordSchema,
  signUpPasswordSchema,
} from "../../../../schemas/sign-up-schema";
import { useSignUpStore } from "../../../../stores/use-sign-up-store";
import * as styles from "./index.css";

export const PasswordForm = () => {
  const { setStep, setData, data } = useSignUpStore();
  const [visibilityState, setVisibilityState] = useState({
    password: false,
    passwordConfirm: false,
  });
  const form = useForm({
    resolver: zodResolver(signUpPasswordSchema),
    defaultValues: {
      password: data.password ?? "",
      passwordConfirm: data.passwordConfirm ?? "",
    },
    mode: "onTouched",
  });

  const onPrevious = () => {
    setStep(2);
  };

  const onNext = (data: SignUpPasswordSchema) => {
    setStep(4);
    setData({
      ...data,
      password: data.password,
      passwordConfirm: data.passwordConfirm,
    });
  };

  const togglePasswordVisibility = () => {
    setVisibilityState({
      ...visibilityState,
      password: !visibilityState.password,
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onNext)} className={styles.form}>
      <Box className={styles.titleContainer}>
        <Title fontSize="t1" color="zinc">
          비밀번호를 입력해주세요
        </Title>
        <Box className={styles.descriptionContainer}>
          <Body fontSize="b3" color="zinc">
            최소 8자 이상, 최대 20자 이하
          </Body>
          <Body fontSize="b3" color="zinc">
            영문/숫자/특수문자/대문자 1개 이상을 포함해주세요
          </Body>
        </Box>
      </Box>

      <Box className={styles.inputContainer}>
        <Input
          label="비밀번호"
          placeholder="최소 8자 이상, 최대 20자 이하"
          {...form.register("password")}
          isError={!!form.formState.errors.password}
          errorMessage={form.formState.errors.password?.message}
          type={visibilityState.password ? "text" : "password"}
          rightIcon={
            <button
              type="button"
              aria-label={
                visibilityState.password ? "비밀번호 숨기기" : "비밀번호 보기"
              }
              aria-pressed={visibilityState.password}
              onClick={togglePasswordVisibility}
              style={{
                cursor: "pointer",
                pointerEvents: "auto",
                background: "none",
                border: "none",
              }}
            >
              {visibilityState.password ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          }
        />
        <Input
          label="비밀번호 확인"
          placeholder="새 비밀번호를 입력해주세요"
          {...form.register("passwordConfirm")}
          isError={!!form.formState.errors.passwordConfirm}
          errorMessage={form.formState.errors.passwordConfirm?.message}
          type={visibilityState.passwordConfirm ? "text" : "password"}
          rightIcon={
            <button
              type="button"
              aria-label={
                visibilityState.passwordConfirm
                  ? "비밀번호 확인 숨기기"
                  : "비밀번호 확인 보기"
              }
              aria-pressed={visibilityState.passwordConfirm}
              onClick={togglePasswordVisibility}
              style={{
                cursor: "pointer",
                pointerEvents: "auto",
                background: "none",
                border: "none",
              }}
            >
              {visibilityState.passwordConfirm ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          }
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
