import { z } from "zod";

export const cafeteriaInfoSchema = z.object({
  name: z.string().min(1, "식당명을 입력해주세요"),
  address: z.string().min(1, "주소를 선택해주세요"),
  detailAddress: z.string().optional(),
  openingHours: z.string().optional(),
  review: z.string().min(1, "리뷰를 입력해주세요"),
});

export type CafeteriaInfoFormData = z.infer<typeof cafeteriaInfoSchema>;
