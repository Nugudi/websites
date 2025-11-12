/**
 * Sign Up Form Schemas
 *
 * Zod validation schemas for sign-up flow
 */

import { z } from "zod";

/**
 * Email Form Schema
 */
export const signUpEmailSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요")
    .email("올바른 이메일 형식이 아닙니다"),
});

export type SignUpEmailSchema = z.infer<typeof signUpEmailSchema>;

/**
 * Email Verification Code Form Schema (if needed)
 */
export const signUpEmailVerificationCodeSchema = z.object({
  code: z
    .string()
    .min(6, "인증번호는 6자리입니다")
    .max(6, "인증번호는 6자리입니다")
    .regex(/^\d+$/, "인증번호는 숫자만 입력 가능합니다"),
});

export type SignUpEmailVerificationCodeSchema = z.infer<
  typeof signUpEmailVerificationCodeSchema
>;

/**
 * Password Form Schema
 */
export const signUpPasswordSchema = z
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

export type SignUpPasswordSchema = z.infer<typeof signUpPasswordSchema>;

/**
 * Nickname Form Schema
 */
export const signUpNicknameSchema = z.object({
  nickname: z
    .string()
    .min(2, "닉네임은 최소 2자 이상이어야 합니다")
    .max(12, "닉네임은 최대 12자 이하여야 합니다")
    .regex(
      /^[가-힣a-zA-Z0-9]+$/,
      "닉네임은 한글, 영문, 숫자만 사용 가능합니다",
    ),
});

export type SignUpNicknameSchema = z.infer<typeof signUpNicknameSchema>;

/**
 * Agreement Form Schema
 */
export const signUpAgreementSchema = z.object({
  acceptPrivacyPolicy: z.boolean().refine((val) => val === true, {
    message: "개인정보 처리방침에 동의해주세요",
  }),
  acceptTermsOfService: z.boolean().refine((val) => val === true, {
    message: "서비스 이용약관에 동의해주세요",
  }),
  acceptMarketingEmail: z.boolean().optional(),
});

export type SignUpAgreementSchema = z.infer<typeof signUpAgreementSchema>;
