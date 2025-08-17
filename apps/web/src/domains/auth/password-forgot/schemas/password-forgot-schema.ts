import { z } from "zod";

export const passwordForgotSchema = z.object({
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
});

export const passwordForgotEmailSchema = passwordForgotSchema.pick({
  email: true,
});

export const passwordForgotEmailVerificationCodeSchema =
  passwordForgotSchema.pick({
    code: true,
  });

export const passwordForgotPasswordSchema = passwordForgotSchema
  .pick({
    password: true,
    passwordConfirm: true,
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordConfirm"],
  });

export type PasswordForgotSchema = z.infer<typeof passwordForgotSchema>;

export type PasswordForgotEmailSchema = z.infer<
  typeof passwordForgotEmailSchema
>;
