import { NextResponse } from "next/server";
import { createAuthServerContainer } from "@/src/di/auth-server-container";

/**
 * 세션 조회 API
 * /api/auth/session
 */
export async function GET() {
  const container = createAuthServerContainer();
  const authService = container.getAuthService();

  const session = await authService.getCurrentSession();

  if (!session) {
    return NextResponse.json(null, { status: 401 });
  }

  return NextResponse.json({ responseType: "SUCCESS", result: session });
}
