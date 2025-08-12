"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SuccessIcon } from "@nugudi/assets-icons";
import { Button } from "@nugudi/react-components-button";
import { Input } from "@nugudi/react-components-input";
import { Box, Flex, Heading } from "@nugudi/react-components-layout";
import Image from "next/image";
import { useForm } from "react-hook-form";
import {
  type SignUpNicknameSchema,
  signUpNicknameSchema,
} from "@/src/domains/auth/sign-up/schemas/sign-up-schema";
import { useSignUpStore } from "@/src/domains/auth/sign-up/stores/use-sign-up-store";
import * as styles from "./index.css";

const NicknameForm = () => {
  const { setData, resetAll } = useSignUpStore();

  const form = useForm<SignUpNicknameSchema>({
    resolver: zodResolver(signUpNicknameSchema),
    defaultValues: {
      nickname: "",
    },
    mode: "onTouched",
  });

  const onSubmit = (data: SignUpNicknameSchema) => {
    setData({
      ...data,
      nickname: data.nickname,
    });
    resetAll();
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
          isError={!!form.formState.errors.nickname}
          errorMessage={form.formState.errors.nickname?.message}
          rightIcon={
            form.formState.isValid && form.formState.isDirty && <SuccessIcon />
          }
        />
      </Box>

      <Button type="submit" color="zinc" variant="brand" size="lg">
        중복확인
      </Button>
    </form>
  );
};

export default NicknameForm;
