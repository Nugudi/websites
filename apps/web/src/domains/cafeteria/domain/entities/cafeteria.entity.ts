/**
 * Cafeteria Domain Entity
 * Entity: camelCase | DTO: snake_case
 */

import { z } from "zod";
import { BusinessHoursSchema } from "./business-hours.entity";
import { CafeteriaMenuSchema } from "./cafeteria-menu.entity";

/** 구내식당 Entity */
export const CafeteriaSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  address: z.string().min(1),
  addressDetail: z.string().nullable(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  phone: z.string().nullable(),
  mealTicketPrice: z.number().int().nullable(),
  takeoutAvailable: z.boolean(),
  businessHours: BusinessHoursSchema,
});

export type Cafeteria = z.infer<typeof CafeteriaSchema>;

/** 구내식당 + 메뉴 (리스트용) */
export const CafeteriaWithMenuSchema = z.object({
  cafeteria: CafeteriaSchema,
  menus: z.array(CafeteriaMenuSchema),
});

export type CafeteriaWithMenu = z.infer<typeof CafeteriaWithMenuSchema>;

/** 구내식당 등록 요청 */
export const RegisterCafeteriaRequestSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  addressDetail: z.string(),
  takeoutAvailable: z.boolean(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  phone: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  oneLineIntro: z.string().nullable().optional(),
  mealTicketPrice: z.number().int().nullable().optional(),
  businessHours: z.any().optional(),
});

export type RegisterCafeteriaRequest = z.infer<
  typeof RegisterCafeteriaRequestSchema
>;
