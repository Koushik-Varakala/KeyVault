export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { NoteRepository } from "@/repositories/note.repo";
import { updateNoteSchema } from "@/validators/note";

// GET /api/v1/notes/[id] - get a single note
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const note = await NoteRepository.findById(id, userId);
    if (!note) return NextResponse.json({ error: "Note not found" }, { status: 404 });

    return NextResponse.json({ note }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH /api/v1/notes/[id] - update a note
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const validated = updateNoteSchema.parse(body);

    const existing = await NoteRepository.findById(id, userId);
    if (!existing) return NextResponse.json({ error: "Note not found" }, { status: 404 });

    await NoteRepository.update(id, userId, validated);
    const updated = await NoteRepository.findById(id, userId);

    return NextResponse.json({ message: "Note updated", note: updated }, { status: 200 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Validation Error", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE /api/v1/notes/[id] - delete a note
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const existing = await NoteRepository.findById(id, userId);
    if (!existing) return NextResponse.json({ error: "Note not found" }, { status: 404 });

    await NoteRepository.delete(id, userId);
    return NextResponse.json({ message: "Note deleted" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
