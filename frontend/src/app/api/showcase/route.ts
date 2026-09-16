import { NextResponse } from "next/server";
import { getProjectSummaries } from "@/lib/server/storage";

export async function GET() {
  return NextResponse.json(getProjectSummaries().slice(0, 8));
}
