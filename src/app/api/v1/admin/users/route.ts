export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { UserRepository } from "@/repositories/user.repo";

export async function GET(req: Request) {
  try {
    // Role is checked in middleware, but we can double check headers
    const role = req.headers.get("x-user-role");
    if (role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
    }

    const users = await UserRepository.findAll();

    return NextResponse.json({ users }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
