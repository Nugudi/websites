import type { cookies } from "next/headers";

export type {
  KakaoLoginResponse,
  LocalLoginResponse,
  SignUpResponse,
  SuccessResponseKakaoLoginResponse,
  SuccessResponseLocalLoginResponse,
  SuccessResponseSignUpResponse,
} from "@nugudi/api/schemas";

export interface CookieOptions
  extends NonNullable<
    Parameters<Awaited<ReturnType<typeof cookies>>["set"]>[2]
  > {}

export * from "./errors";
export * from "./provider";
export * from "./session";
