import { NextResponse } from "next/server";
import { getProjectSummaries } from "@/lib/server/storage";

export async function GET() {
  const summaries = await getProjectSummaries();
  return NextResponse.json(summaries.slice(0, 8));
}
