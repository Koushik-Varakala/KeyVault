export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { LogRepository } from "@/repositories/log.repo";

export async function GET(req: Request) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const stats = await LogRepository.getUsageStats(userId);

    return NextResponse.json({ stats }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
