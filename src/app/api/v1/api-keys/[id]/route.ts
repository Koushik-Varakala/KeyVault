export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { ApiKeyService } from "@/services/apiKey.service";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = req.headers.get("x-user-id");
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await ApiKeyService.revokeApiKey(id, userId);

    return NextResponse.json({ message: "API Key revoked successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
