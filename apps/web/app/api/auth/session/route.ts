import { NextResponse } from "next/server";
import { auth } from "@/src/domains/auth";

/**
 * 현재 세션 정보 조회 API
 */
export async function GET() {
  try {
    const session = await auth.getClientSession();

    if (!session) {
      return NextResponse.json(
        { error: "No session found", result: null },
        { status: 401 },
      );
    }

    return NextResponse.json({
      result: session,
    });
  } catch (error) {
    console.error("Error fetching session:", error);
    return NextResponse.json(
      { error: "Failed to fetch session", result: null },
      { status: 500 },
    );
  }
}
