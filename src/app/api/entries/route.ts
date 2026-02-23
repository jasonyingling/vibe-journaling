import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { entries } from "@/db/schema";
import { desc, gte, lte, and, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const limit = searchParams.get("limit");

  const conditions = [];
  if (from) conditions.push(gte(entries.date, from));
  if (to) conditions.push(lte(entries.date, to));

  const query = db
    .select()
    .from(entries)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(entries.date));

  if (limit) {
    query.limit(parseInt(limit, 10));
  }

  const results = query.all();
  return NextResponse.json(results);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { content, date, promptText } = body;

  if (!content || !date) {
    return NextResponse.json(
      { error: "Content and date are required" },
      { status: 400 }
    );
  }

  // Validate date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json(
      { error: "Date must be in YYYY-MM-DD format" },
      { status: 400 }
    );
  }

  try {
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
  } catch (err: unknown) {
    const error = err as { message?: string };
    if (error.message?.includes("UNIQUE constraint failed")) {
      return NextResponse.json(
        { error: "An entry already exists for this date" },
        { status: 409 }
      );
    }
    throw err;
  }
}
