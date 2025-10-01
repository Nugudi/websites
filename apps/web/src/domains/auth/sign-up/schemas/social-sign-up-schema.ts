import { z } from "zod";

export const socialSignUpSchema = z.object({
  nickname: z
    .string()
    .min(2, "최소 2자 이상 입력해주세요")
    .max(12, "최대 12자 이하로 입력해주세요"),
  privacyPolicy: z.boolean().refine((val) => val === true, {
    message: "개인정보 처리방침에 동의해주세요",
  }),
  termsOfService: z.boolean().refine((val) => val === true, {
    message: "이용약관에 동의해주세요",
  }),
  locationInfo: z.boolean().refine((val) => val === true, {
    message: "위치정보 수집·이용약관에 동의해주세요",
  }),
  marketingEmail: z.boolean().default(false),
});

export type SocialSignUpSchema = z.infer<typeof socialSignUpSchema>;
