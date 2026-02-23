import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { entries } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: { date: string } }
) {
  const { date } = params;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json(
      { error: "Date must be in YYYY-MM-DD format" },
      { status: 400 }
    );
  }

  const entry = db
    .select()
    .from(entries)
    .where(eq(entries.date, date))
    .get();

  if (!entry) {
    return NextResponse.json(null);
  }

  return NextResponse.json(entry);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { date: string } }
) {
  const { date } = params;
  const body = await request.json();
  const { content, promptText } = body;

  if (!content) {
    return NextResponse.json(
      { error: "Content is required" },
      { status: 400 }
    );
  }

  // Check if entry exists
  const existing = db
    .select()
    .from(entries)
    .where(eq(entries.date, date))
    .get();

  if (!existing) {
    // Create new entry
    const result = db
      .insert(entries)
      .values({
        content,
        date,
        promptText: promptText || null,
      })
      .returning()
      .get();

    return NextResponse.json(result, { status: 201 });
  }

  // Update existing entry
  const result = db
    .update(entries)
    .set({
      content,
      promptText: promptText !== undefined ? promptText : existing.promptText,
      updatedAt: sql`CURRENT_TIMESTAMP`,
    })
    .where(eq(entries.date, date))
    .returning()
    .get();

  return NextResponse.json(result);
}
