"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { checkNicknameAvailability } from "@nugudi/api";
import { SuccessIcon } from "@nugudi/assets-icons";
import { Button } from "@nugudi/react-components-button";
import { Input } from "@nugudi/react-components-input";
import { Box, Flex, Heading } from "@nugudi/react-components-layout";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useSocialSignUpStore } from "../../../../../stores/use-social-sign-up-store";
import * as styles from "./index.css";

const nicknameSchema = z.object({
  nickname: z
    .string()
    .min(2, "최소 2자 이상 입력해주세요")
    .max(12, "최대 12자 이하로 입력해주세요"),
});

type NicknameSchema = z.infer<typeof nicknameSchema>;

interface SocialNicknameFormProps {
  onNext: () => void;
}

export const SocialNicknameForm = ({ onNext }: SocialNicknameFormProps) => {
  const { setData } = useSocialSignUpStore();
  const [isDuplicateChecked, setIsDuplicateChecked] = useState(false);
  const [isDuplicateLoading, setIsDuplicateLoading] = useState(false);
  const [duplicateError, setDuplicateError] = useState<string | null>(null);

  const form = useForm<NicknameSchema>({
    resolver: zodResolver(nicknameSchema),
    defaultValues: {
      nickname: "",
    },
    mode: "onTouched",
  });

  const checkNicknameDuplicate = async (nickname: string) => {
    setIsDuplicateLoading(true);
    setDuplicateError(null);

    try {
      const response = await checkNicknameAvailability({ nickname });

      if (response.data.data?.available) {
        setIsDuplicateChecked(true);
      } else {
        setDuplicateError("이미 사용 중인 닉네임입니다.");
        setIsDuplicateChecked(false);
      }
    } catch {
      setDuplicateError("중복 확인 중 오류가 발생했습니다.");
      setIsDuplicateChecked(false);
    } finally {
      setIsDuplicateLoading(false);
    }
  };

  const onSubmit = async (data: NicknameSchema) => {
    if (!isDuplicateChecked) {
      await checkNicknameDuplicate(data.nickname);
    } else {
      setData({ nickname: data.nickname });
      onNext();
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
    </form>
  );
};
