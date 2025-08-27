"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SuccessIcon } from "@nugudi/assets-icons";
import { Button } from "@nugudi/react-components-button";
import { Input } from "@nugudi/react-components-input";
import { Box, Flex, Heading, HStack } from "@nugudi/react-components-layout";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  type SignUpNicknameSchema,
  signUpNicknameSchema,
} from "../../../../../schemas/sign-up-schema";
import { useSignUpStore } from "../../../../../stores/use-sign-up-store";
import * as styles from "./index.css";

const NicknameForm = () => {
  const { setData, setStep } = useSignUpStore();
  const [isDuplicateChecked, setIsDuplicateChecked] = useState(false);
  const [isDuplicateLoading, setIsDuplicateLoading] = useState(false);
  const [duplicateError, setDuplicateError] = useState<string | null>(null);

  const form = useForm<SignUpNicknameSchema>({
    resolver: zodResolver(signUpNicknameSchema),
    defaultValues: {
      nickname: "",
    },
    mode: "onTouched",
  });

  const checkNicknameDuplicate = async (nickname: string) => {
    setIsDuplicateLoading(true);
    setDuplicateError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const duplicateNicknames = ["매튜", "애옹", "조이"];
      const isDuplicate = duplicateNicknames.includes(nickname.toLowerCase());

      if (isDuplicate) {
        setDuplicateError("이미 사용 중인 닉네임입니다.");
        setIsDuplicateChecked(false);
      } else {
        setIsDuplicateChecked(true);
      }
    } catch {
      setDuplicateError("중복 확인 중 오류가 발생했습니다.");
      setIsDuplicateChecked(false);
    } finally {
      setIsDuplicateLoading(false);
    }
  };

  const onSubmit = async (data: SignUpNicknameSchema) => {
    if (!isDuplicateChecked) {
      await checkNicknameDuplicate(data.nickname);
    } else {
      setData({
        ...data,
        nickname: data.nickname,
      });
      setStep(5);
    }
  };

  const onPrevious = () => {
    setStep(3);
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
          {...form.register("nickname", {
            onChange: () => {
              setIsDuplicateChecked(false);
              setDuplicateError(null);
            },
          })}
          isError={!!form.formState.errors.nickname || !!duplicateError}
          errorMessage={
            form.formState.errors.nickname?.message ||
            duplicateError ||
            undefined
          }
          rightIcon={isDuplicateChecked && !duplicateError && <SuccessIcon />}
        />
      </Box>

      <HStack gap="5">
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
          disabled={isDuplicateLoading || !form.formState.isValid}
          width="full"
        >
          {isDuplicateLoading
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

export default NicknameForm;
