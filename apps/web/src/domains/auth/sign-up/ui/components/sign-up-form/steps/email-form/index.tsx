"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nugudi/react-components-button";
import { Input } from "@nugudi/react-components-input";
import { Box, Title } from "@nugudi/react-components-layout";
import { useForm } from "react-hook-form";
import {
  type SignUpEmailSchema,
  signUpEmailSchema,
} from "../../../../../schemas/sign-up-schema";
import { useSignUpStore } from "../../../../../stores/use-sign-up-store";
import * as styles from "./index.css";

const EmailForm = () => {
  const { setStep, setData, data } = useSignUpStore();

  const form = useForm<SignUpEmailSchema>({
    resolver: zodResolver(signUpEmailSchema),
    defaultValues: {
      email: data.email ?? "",
    },
    mode: "onTouched",
  });

  const onSubmit = (data: SignUpEmailSchema) => {
    setStep(2);
    setData({
      ...data,
      email: data.email,
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form}>
      <Box className={styles.titleContainer}>
        <Title fontSize="t1" color="zinc">
          이메일을 입력해주세요
        </Title>
      </Box>

      <Box className={styles.inputContainer}>
        <Input
          placeholder="이메일"
          {...form.register("email")}
          isError={!!form.formState.errors.email}
          errorMessage={form.formState.errors.email?.message}
        />
      </Box>

      <Button type="submit" color="zinc" variant="brand" size="lg">
        다음
      </Button>
    </form>
  );
};

export default EmailForm;
