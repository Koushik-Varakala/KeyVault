export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { ApiKeyService } from "@/services/apiKey.service";
import { rateLimit } from "@/lib/rateLimit";
import { LogRepository } from "@/repositories/log.repo";

export async function GET(req: Request) {
  // Extract API key from header
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized: Missing API Key" }, { status: 401 });
  }

  const apiKeyString = authHeader.split(" ")[1];

  // Validate API key
  const apiKey = await ApiKeyService.validateApiKey(apiKeyString);
  if (!apiKey) {
    return NextResponse.json({ error: "Unauthorized: Invalid or revoked API Key" }, { status: 401 });
  }

  // Rate Limiting
  const { success, limit, remaining, reset } = await rateLimit(apiKey.id);

  // Log the request asynchronously
  LogRepository.logRequest({
    apiKeyId: apiKey.id,
    endpoint: "/api/v1/protected-data",
    method: "GET",
    statusCode: success ? 200 : 429,
  });

  if (!success) {
    return NextResponse.json(
      { error: "Too Many Requests", retryAfter: new Date(reset).toISOString() },
      { 
        status: 429, 
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        } 
      }
    );
  }

  return NextResponse.json(
    {
      message: "Successfully accessed protected data!",
      data: {
        marketStatus: "OPEN",
        btcPrice: 64500.50,
        ethPrice: 3450.25,
        timestamp: new Date().toISOString()
      }
    }, 
    { 
      status: 200,
      headers: {
        "X-RateLimit-Limit": limit.toString(),
        "X-RateLimit-Remaining": remaining.toString(),
        "X-RateLimit-Reset": reset.toString(),
      }
    }
  );
}
