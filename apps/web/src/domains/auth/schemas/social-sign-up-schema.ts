import { z } from "zod";

// Step1: 닉네임 스키마
export const socialSignUpNicknameSchema = z.object({
  nickname: z
    .string()
    .min(2, { message: "닉네임은 최소 2자 이상이어야 합니다." })
    .max(12, { message: "닉네임은 최대 12자까지 가능합니다." }),
});

export type SocialSignUpNicknameSchema = z.infer<
  typeof socialSignUpNicknameSchema
>;

// Step2: 약관 동의 스키마
export const socialSignUpAgreementSchema = z.object({
  privacyPolicy: z.boolean().refine((val) => val === true, {
    message: "개인정보 처리 방침 동의는 필수입니다.",
  }),
  termsOfService: z.boolean().refine((val) => val === true, {
    message: "이용 약관 동의는 필수입니다.",
  }),
  locationInfo: z.boolean().refine((val) => val === true, {
    message: "위치정보 이용 동의는 필수입니다.",
  }),
  marketingEmail: z.boolean().optional(),
});

export type SocialSignUpAgreementSchema = z.infer<
  typeof socialSignUpAgreementSchema
>;

// 전체 소셜 회원가입 스키마
export const socialSignUpSchema = z.object({
  nickname: z.string().min(2).max(12),
  privacyPolicy: z.boolean(),
  termsOfService: z.boolean(),
  locationInfo: z.boolean(),
  marketingEmail: z.boolean().optional(),
});

export type SocialSignUpSchema = z.infer<typeof socialSignUpSchema>;
