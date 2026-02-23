import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { pillars } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);
  const body = await request.json();
  const { name, description, sortOrder } = body;

  if (!name) {
    return NextResponse.json(
      { error: "Name is required" },
      { status: 400 }
    );
  }

  const existing = db
    .select()
    .from(pillars)
    .where(eq(pillars.id, id))
    .get();

  if (!existing) {
    return NextResponse.json(
      { error: "Pillar not found" },
      { status: 404 }
    );
  }

  const result = db
    .update(pillars)
    .set({
      name,
      description: description !== undefined ? description : existing.description,
      sortOrder: sortOrder !== undefined ? sortOrder : existing.sortOrder,
    })
    .where(eq(pillars.id, id))
    .returning()
    .get();

  return NextResponse.json(result);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);

  const existing = db
    .select()
    .from(pillars)
    .where(eq(pillars.id, id))
    .get();

  if (!existing) {
    return NextResponse.json(
      { error: "Pillar not found" },
      { status: 404 }
    );
  }

  db.delete(pillars).where(eq(pillars.id, id)).run();

  return NextResponse.json({ success: true });
}
