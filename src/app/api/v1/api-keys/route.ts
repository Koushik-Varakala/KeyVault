export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { ApiKeyService } from "@/services/apiKey.service";

export async function GET(req: Request) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const apiKeys = await ApiKeyService.getUserApiKeys(userId);
    
    return NextResponse.json({ apiKeys }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const name = body.name || "Default Key";

    const newKey = await ApiKeyService.createApiKey(userId, name);
    
    return NextResponse.json({ message: "API Key created", apiKey: newKey }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
