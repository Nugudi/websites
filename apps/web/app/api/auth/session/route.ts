import { NextResponse } from "next/server";
import { auth } from "@/src/domains/auth/auth-server";

/**
 * 세션 조회 API
 * /api/auth/session
 */
export async function GET() {
  const session = await auth.getClientSession();

  if (!session) {
    return NextResponse.json(null, { status: 401 });
  }

  return NextResponse.json({ responseType: "SUCCESS", result: session });
}
