/**
 * Cafeteria Menu Domain Entities
 * Entity: camelCase | DTO: snake_case
 */

import { z } from "zod";

export const MenuCategorySchema = z.enum([
  "RICE",
  "SOUP",
  "MAIN_DISH",
  "SIDE_DISH",
  "KIMCHI",
  "SALAD",
  "DESSERT",
  "DRINK",
  "SPECIAL",
]);

export type MenuCategory = z.infer<typeof MenuCategorySchema>;

/** 메뉴 항목 */
export const MenuItemSchema = z.object({
  name: z.string().min(1),
  category: MenuCategorySchema,
  calories: z.number().int().nullable(),
});

export type MenuItem = z.infer<typeof MenuItemSchema>;

/** 영양 정보 */
export const NutritionInfoSchema = z.object({
  totalCalories: z.number().int().nullable(),
  dailyPercentage: z.number().int().nullable(),
  walkingSteps: z.number().int().nullable(),
  runningKm: z.number().int().nullable(),
  cyclingKm: z.number().int().nullable(),
});

export type NutritionInfo = z.infer<typeof NutritionInfoSchema>;

/** 구내식당 메뉴 */
export const CafeteriaMenuSchema = z.object({
  mealType: z.string().min(1),
  menuItems: z.array(MenuItemSchema),
  specialNote: z.string().nullable(),
  nutritionInfo: NutritionInfoSchema,
});

export type CafeteriaMenu = z.infer<typeof CafeteriaMenuSchema>;

/** 메뉴 가용성 (캘린더용) */
export const MenuAvailabilitySchema = z.object({
  year: z.number().int().min(2000).max(2100),
  month: z.number().int().min(1).max(12),
  availableDates: z.array(z.number().int().min(1).max(31)),
});

export type MenuAvailability = z.infer<typeof MenuAvailabilitySchema>;

/** MealType Enum */
export const MealTypeSchema = z.enum(["BREAKFAST", "LUNCH", "DINNER"]);

export type MealType = z.infer<typeof MealTypeSchema>;

/** 구내식당 메뉴 등록 요청 */
export const RegisterCafeteriaMenuRequestSchema = z.object({
  restaurantId: z.number().int().positive(),
  menuDate: z.string(),
  mealType: MealTypeSchema,
  menuItems: z.array(MenuItemSchema),
  menuImageFileId: z.number().int().nullable().optional(),
  specialNote: z.string().nullable().optional(),
});

export type RegisterCafeteriaMenuRequest = z.infer<
  typeof RegisterCafeteriaMenuRequestSchema
>;
