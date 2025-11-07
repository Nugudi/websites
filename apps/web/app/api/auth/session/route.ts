import { NextResponse } from "next/server";
import { createAuthServerContainer } from "@/src/domains/auth/di/auth-server-container";

/**
 * 세션 조회 API
 * /api/auth/session
 */
export async function GET() {
  const container = createAuthServerContainer();
  const getCurrentSessionUseCase = container.getCurrentSession();

  const session = await getCurrentSessionUseCase.execute();

  if (!session) {
    return NextResponse.json(null, { status: 401 });
  }

  return NextResponse.json({ responseType: "SUCCESS", result: session });
}
