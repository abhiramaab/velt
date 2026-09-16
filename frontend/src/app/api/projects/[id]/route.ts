import { NextResponse } from "next/server";
import { getProject } from "@/lib/server/storage";

export async function GET(_req: Request, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const project = await getProject(id);
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }
  return NextResponse.json(project);
}
