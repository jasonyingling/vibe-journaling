import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { pillars } from "@/db/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  const results = db
    .select()
    .from(pillars)
    .orderBy(asc(pillars.sortOrder))
    .all();

  return NextResponse.json(results);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, description, sortOrder } = body;

  if (!name) {
    return NextResponse.json(
      { error: "Name is required" },
      { status: 400 }
    );
  }

  const result = db
    .insert(pillars)
    .values({
      name,
      description: description || null,
      sortOrder: sortOrder ?? 0,
    })
    .returning()
    .get();

  return NextResponse.json(result, { status: 201 });
}
