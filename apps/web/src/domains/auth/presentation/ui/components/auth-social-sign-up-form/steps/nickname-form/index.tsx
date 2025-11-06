"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SuccessIcon } from "@nugudi/assets-icons";
import { Button } from "@nugudi/react-components-button";
import { Input } from "@nugudi/react-components-input";
import { Box, Flex, Heading, HStack } from "@nugudi/react-components-layout";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { getUserClientContainer } from "@/src/domains/user/di/user-client-container";
import {
  type SocialSignUpNicknameSchema,
  socialSignUpNicknameSchema,
} from "../../../../../schemas/social-sign-up-schema";
import { useSocialSignUpStore } from "../../../../../stores/use-social-sign-up-store";
import * as styles from "./index.css";

export const NicknameForm = () => {
  const { setData, setStep } = useSocialSignUpStore();

  const form = useForm<SocialSignUpNicknameSchema>({
    resolver: zodResolver(socialSignUpNicknameSchema),
    defaultValues: {
      nickname: "",
    },
    mode: "onTouched",
  });

  const {
    mutateAsync: checkNickname,
    isPending,
    isSuccess,
    data: checkResult,
    error,
  } = useMutation({
    mutationFn: (nickname: string) => {
      const container = getUserClientContainer();
      const checkNicknameAvailabilityUseCase =
        container.getCheckNicknameAvailability();
      return checkNicknameAvailabilityUseCase.execute(nickname);
    },
  });

  const isAvailable = checkResult?.available;
  const isDuplicateChecked = isSuccess && isAvailable;
  const duplicateError =
    isSuccess && !isAvailable
      ? "이미 사용 중인 닉네임입니다."
      : error
        ? "닉네임 확인 중 오류가 발생했습니다."
        : null;

  const onSubmit = async (data: SocialSignUpNicknameSchema) => {
    if (!isDuplicateChecked) {
      await checkNickname(data.nickname);
    } else {
      setData({ nickname: data.nickname });
      setStep(2);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form}>
      <Box className={styles.titleContainer}>
        <Heading fontSize="h1" color="zinc">
          어떤 닉네임으로
        </Heading>
        <Heading fontSize="h1" color="zinc">
          불러드릴까요?
        </Heading>
      </Box>

      <Flex direction="column" align="center" className={styles.imageContainer}>
        <Image
          src="/images/bobpool-nuguri.webp"
          alt="밥풀너구리이미지"
          width={240}
          height={230}
          priority
        />
      </Flex>

      <Box className={styles.inputContainer}>
        <Input
          label="닉네임"
          placeholder="2자 이상 12자 이하의 닉네임"
          {...form.register("nickname")}
          isError={!!form.formState.errors.nickname || !!duplicateError}
          errorMessage={
            form.formState.errors.nickname?.message ||
            duplicateError ||
            undefined
          }
          rightIcon={isDuplicateChecked && <SuccessIcon />}
        />
      </Box>

      <HStack gap={20}>
        <Button
          type="submit"
          color="zinc"
          variant="brand"
          size="lg"
          disabled={isPending || !form.formState.isValid}
          width="full"
        >
          {isPending
            ? "확인 중..."
            : isDuplicateChecked
              ? "다음"
              : form.formState.isValid && form.formState.isDirty
                ? "중복확인"
                : "다음"}
        </Button>
      </HStack>
    </form>
  );
};
