import { z } from "zod";

export const signUpSchema = z.object({
  email: z.email("올바른 이메일 주소를 입력해주세요"),
  code: z.string().min(6, "올바른 인증 코드를 입력해주세요"),
  password: z.string().min(8, "최소 8자 이상 입력해주세요"),
  passwordConfirm: z.string().min(8, "최소 8자 이상 입력해주세요"),
  nickname: z.string().min(2, "최소 2자 이상 입력해주세요"),
});

export type SignUpSchema = z.infer<typeof signUpSchema>;
