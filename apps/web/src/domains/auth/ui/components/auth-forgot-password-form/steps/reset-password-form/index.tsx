import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon } from "@nugudi/assets-icons";
import { Button } from "@nugudi/react-components-button";
import { Input } from "@nugudi/react-components-input";
import { Body, Box, HStack, Title } from "@nugudi/react-components-layout";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  type ForgotPasswordPasswordSchema,
  forgotPasswordPasswordSchema,
} from "../../../../../schemas/forgot-password-schema";
import { useForgotPasswordStore } from "../../../../../stores/use-forgot-password-store";
import * as styles from "./index.css";

interface ResetPasswordFormProps {
  onPrevious: () => void;
  onSubmit: () => void;
}

export const ResetPasswordForm = ({
  onPrevious,
  onSubmit,
}: ResetPasswordFormProps) => {
  const { setData, data } = useForgotPasswordStore();

  const [visibilityState, setVisibilityState] = useState({
    password: false,
    passwordConfirm: false,
  });

  const form = useForm({
    resolver: zodResolver(forgotPasswordPasswordSchema),
    defaultValues: {
      password: data.password ?? "",
      passwordConfirm: data.passwordConfirm ?? "",
    },
    mode: "onTouched",
  });

  const onNext = (data: ForgotPasswordPasswordSchema) => {
    setData({
      ...data,
      password: data.password,
      passwordConfirm: data.passwordConfirm,
    });
    onSubmit();
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
          color="main"
          variant="brand"
          size="lg"
          width="full"
        >
          비밀번호 변경
        </Button>
      </HStack>
    </form>
  );
};
