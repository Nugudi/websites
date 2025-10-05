import { z } from "zod";
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  VERIFICATION_CODE_LENGTH,
} from "../constants/sign-up";

export const signUpSchema = z.object({
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
  nickname: z
    .string()
    .min(2, "최소 2자 이상 입력해주세요")
    .max(12, "최대 12자 이하로 입력해주세요"),
  acceptPrivacyPolicy: z.boolean(),
  acceptTermsOfService: z.boolean(),
  acceptMarketingEmail: z.boolean(),
});

export const signUpEmailSchema = signUpSchema.pick({
  email: true,
});

export const signUpEmailVerificationCodeSchema = signUpSchema.pick({
  code: true,
});

export const signUpPasswordSchema = signUpSchema
  .pick({
    password: true,
    passwordConfirm: true,
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordConfirm"],
  });

export const signUpNicknameSchema = signUpSchema.pick({
  nickname: true,
});

export const signUpAgreementSchema = signUpSchema.pick({
  acceptPrivacyPolicy: true,
  acceptTermsOfService: true,
  acceptMarketingEmail: true,
});

export type SignUpSchema = z.infer<typeof signUpSchema>;

export type SignUpEmailSchema = z.infer<typeof signUpEmailSchema>;

export type SignUpEmailVerificationCodeSchema = z.infer<
  typeof signUpEmailVerificationCodeSchema
>;

export type SignUpPasswordSchema = z.infer<typeof signUpPasswordSchema>;

export type SignUpNicknameSchema = z.infer<typeof signUpNicknameSchema>;

export type SignUpAgreementSchema = z.infer<typeof signUpAgreementSchema>;
