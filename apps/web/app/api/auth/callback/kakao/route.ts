import type { NextRequest } from "next/server";
import { auth } from "@/src/domains/auth";

/**
 * 카카오 OAuth 콜백 핸들러
 *
 * 카카오 로그인 후 리다이렉트되는 엔드포인트
 * - 프로덕션: https://nugudi.com/api/auth/callback/kakao
 * - 로컬: http://localhost:3000/api/auth/callback/kakao
 */
export async function GET(request: NextRequest) {
  return auth.callback(request);
}
