import { z } from "zod";

export const profileEditSchema = z.object({
  nickname: z
    .string()
    .min(2, "닉네임은 최소 2자 이상이어야 합니다")
    .max(10, "닉네임은 최대 10자까지 가능합니다")
    .regex(
      /^[a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ]+$/,
      "닉네임은 영문, 한글, 숫자만 사용할 수 있습니다",
    )
    .refine((val) => !val.includes(" "), {
      message: "닉네임에 공백을 포함할 수 없습니다",
    }),
  height: z
    .number()
    .min(130, "키는 최소 130cm 이상이어야 합니다")
    .max(220, "키는 최대 220cm까지 입력 가능합니다")
    .optional(),
  weight: z
    .number()
    .min(30, "몸무게는 최소 30kg 이상이어야 합니다")
    .max(250, "몸무게는 최대 250kg까지 입력 가능합니다")
    .optional(),
});

export type ProfileEditFormData = z.infer<typeof profileEditSchema>;
