export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { NoteRepository } from "@/repositories/note.repo";
import { createNoteSchema } from "@/validators/note";

// GET /api/v1/notes - list all notes for the logged-in user
export async function GET(req: Request) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const notes = await NoteRepository.findAllByUser(userId);
    return NextResponse.json({ notes }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/v1/notes - create a new note
export async function POST(req: Request) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const validated = createNoteSchema.parse(body);
    const note = await NoteRepository.create(userId, validated);

    return NextResponse.json({ message: "Note created", note }, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Validation Error", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
