import { z } from "zod";
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  VERIFICATION_CODE_LENGTH,
} from "../constants/forgot-password";

export const forgotPasswordSchema = z.object({
  email: z.email("올바른 이메일 주소를 입력해주세요"),
  code: z
    .string()
    .min(
      VERIFICATION_CODE_LENGTH,
      `${VERIFICATION_CODE_LENGTH}자리 인증 코드를 입력해주세요`,
    ),
  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH, `최소 ${PASSWORD_MIN_LENGTH}자 이상 입력해주세요`)
    .max(
      PASSWORD_MAX_LENGTH,
      `최대 ${PASSWORD_MAX_LENGTH}자 이하로 입력해주세요`,
    )
    .regex(
      PASSWORD_REGEX,
      "영문, 숫자, 특수문자, 대문자를 각각 1개 이상 포함해주세요",
    ),
  passwordConfirm: z
    .string()
    .min(PASSWORD_MIN_LENGTH, `최소 ${PASSWORD_MIN_LENGTH}자 이상 입력해주세요`)
    .max(
      PASSWORD_MAX_LENGTH,
      `최대 ${PASSWORD_MAX_LENGTH}자 이하로 입력해주세요`,
    ),
});

export const forgotPasswordEmailSchema = forgotPasswordSchema.pick({
  email: true,
});

export const forgotPasswordEmailVerificationCodeSchema =
  forgotPasswordSchema.pick({
    code: true,
  });

export const forgotPasswordPasswordSchema = forgotPasswordSchema
  .pick({
    password: true,
    passwordConfirm: true,
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordConfirm"],
  });

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

export type ForgotPasswordEmailSchema = z.infer<
  typeof forgotPasswordEmailSchema
>;

export type ForgotPasswordEmailVerificationCodeSchema = z.infer<
  typeof forgotPasswordEmailVerificationCodeSchema
>;

export type ForgotPasswordPasswordSchema = z.infer<
  typeof forgotPasswordPasswordSchema
>;
