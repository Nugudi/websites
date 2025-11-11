/**
 * Forgot Password Form Schemas
 *
 * Zod validation schemas for forgot password flow
 */

import { z } from "zod";

/**
 * Email Form Schema
 */
export const forgotPasswordEmailSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요")
    .email("올바른 이메일 형식이 아닙니다"),
});

export type ForgotPasswordEmailSchema = z.infer<
  typeof forgotPasswordEmailSchema
>;

/**
 * Email Verification Code Form Schema
 */
export const forgotPasswordEmailVerificationCodeSchema = z.object({
  code: z
    .string()
    .min(6, "인증번호는 6자리입니다")
    .max(6, "인증번호는 6자리입니다")
    .regex(/^\d+$/, "인증번호는 숫자만 입력 가능합니다"),
});

export type ForgotPasswordEmailVerificationCodeSchema = z.infer<
  typeof forgotPasswordEmailVerificationCodeSchema
>;

/**
 * Password Form Schema
 */
export const forgotPasswordPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "비밀번호는 최소 8자 이상이어야 합니다")
      .max(20, "비밀번호는 최대 20자 이하여야 합니다")
      .regex(/[a-z]/, "영문 소문자를 1개 이상 포함해야 합니다")
      .regex(/[A-Z]/, "영문 대문자를 1개 이상 포함해야 합니다")
      .regex(/[0-9]/, "숫자를 1개 이상 포함해야 합니다")
      .regex(/[!@#$%^&*(),.?":{}|<>]/, "특수문자를 1개 이상 포함해야 합니다"),
    passwordConfirm: z.string().min(1, "비밀번호 확인을 입력해주세요"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["passwordConfirm"],
  });

export type ForgotPasswordPasswordSchema = z.infer<
  typeof forgotPasswordPasswordSchema
>;
