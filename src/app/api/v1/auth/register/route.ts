export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { AuthService } from "@/services/auth.service";
import { registerSchema } from "@/validators/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = registerSchema.parse(body);

    const user = await AuthService.register(validatedData);

    return NextResponse.json(
      { message: "User registered successfully", user: { id: user.id, email: user.email } },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Validation Error", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 400 });
  }
}
