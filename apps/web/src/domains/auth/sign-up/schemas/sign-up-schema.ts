import { z } from "zod";

export const signUpSchema = z.object({
  email: z.email("올바른 이메일 주소를 입력해주세요"),
  code: z.string().min(6, "올바른 인증 코드를 입력해주세요"),
  password: z
    .string()
    .min(8, "최소 8자 이상 입력해주세요")
    .max(20, "최대 20자 이하로 입력해주세요")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]+$/,
      "영문, 숫자, 특수문자, 대문자를 각각 1개 이상 포함해주세요",
    ),
  passwordConfirm: z
    .string()
    .min(8, "최소 8자 이상 입력해주세요")
    .max(20, "최대 20자 이하로 입력해주세요"),
  nickname: z
    .string()
    .min(2, "최소 2자 이상 입력해주세요")
    .max(12, "최대 12자 이하로 입력해주세요"),
  acceptPrivacyPolicy: z.boolean().refine((value) => value, {
    message: "개인정보 처리 방침 동의가 필요합니다.",
  }),
  acceptTermsOfService: z.boolean().refine((value) => value, {
    message: "이용 약관 동의가 필요합니다.",
  }),
  acceptMarketingEmail: z.boolean().refine((value) => value, {
    message: "마케팅 수신 동의가 필요합니다.",
  }),
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
