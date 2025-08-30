"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon } from "@nugudi/assets-icons";
import { Button } from "@nugudi/react-components-button";
import { Input } from "@nugudi/react-components-input";
import { Flex } from "@nugudi/react-components-layout";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import * as styles from "./index.css";

const formSchema = z.object({
  email: z.email("올바른 이메일 주소를 입력해주세요"),
  password: z.string().min(8, "최소 8자 이상 입력해주세요"),
});

type FormData = z.infer<typeof formSchema>;

const EmailLoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
  });

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <Flex direction="column" gap="16" className={styles.inputContainer}>
        <Input
          label="이메일"
          placeholder="이메일을 입력하세요"
          {...register("email")}
          isError={!!errors.email}
          errorMessage={errors.email?.message}
        />
        <Input
          label="비밀번호"
          placeholder="비밀번호를 입력하세요"
          {...register("password")}
          isError={!!errors.password}
          errorMessage={errors.password?.message}
          type={showPassword ? "text" : "password"}
          rightIcon={
            <button
              type="button"
              aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
              aria-pressed={showPassword}
              onClick={togglePasswordVisibility}
              style={{
                cursor: "pointer",
                pointerEvents: "auto",
                background: "none",
                border: "none",
              }}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          }
        />
        <Flex
          gap="4"
          align="center"
          justify="center"
          className={styles.linksContainer}
        >
          <Link href="/auth/forgot-password" className={styles.authLink}>
            비밀번호 찾기
          </Link>
          <span className={styles.divider}>|</span>
          <Link href="/auth/sign-up" className={styles.authLink}>
            회원가입
          </Link>
        </Flex>
      </Flex>

      <Button type="submit" color="main" variant="brand" size="lg">
        다음
      </Button>
    </form>
  );
};

export default EmailLoginForm;
