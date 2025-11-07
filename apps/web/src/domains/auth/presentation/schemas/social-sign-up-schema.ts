/**
 * Social Sign Up Form Schemas
 *
 * Zod validation schemas for social OAuth sign-up flow
 */

import { z } from "zod";

/**
 * Nickname Form Schema
 */
export const socialSignUpNicknameSchema = z.object({
  nickname: z
    .string()
    .min(2, "닉네임은 최소 2자 이상이어야 합니다")
    .max(12, "닉네임은 최대 12자 이하여야 합니다")
    .regex(
      /^[가-힣a-zA-Z0-9]+$/,
      "닉네임은 한글, 영문, 숫자만 사용 가능합니다",
    ),
});

export type SocialSignUpNicknameSchema = z.infer<
  typeof socialSignUpNicknameSchema
>;

/**
 * Agreement Form Schema
 */
export const socialSignUpAgreementSchema = z.object({
  privacyPolicy: z.boolean().refine((val) => val === true, {
    message: "개인정보 처리방침에 동의해주세요",
  }),
  termsOfService: z.boolean().refine((val) => val === true, {
    message: "서비스 이용약관에 동의해주세요",
  }),
  locationInfo: z.boolean().refine((val) => val === true, {
    message: "위치정보 이용약관에 동의해주세요",
  }),
  marketingEmail: z.boolean().optional(),
});

export type SocialSignUpAgreementSchema = z.infer<
  typeof socialSignUpAgreementSchema
>;
