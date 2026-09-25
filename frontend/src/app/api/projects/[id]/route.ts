import { NextResponse } from "next/server";
import { getProject } from "@/lib/server/storage";
import { extractAuthUser } from "@/lib/server/jwt";

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
  const authUser = extractAuthUser(req);
  if (!authUser) {
    return NextResponse.json({ error: "Unauthorized: Valid JWT required." }, { status: 401 });
  }

  const { id } = await props.params;
  const project = await getProject(id);
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }
  return NextResponse.json(project);
}

export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
  const authUser = extractAuthUser(req);
  if (!authUser) {
    return NextResponse.json({ error: "Unauthorized: Valid JWT required." }, { status: 401 });
  }

  const { id } = await props.params;
  const project = await getProject(id);
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  try {
    const body = await req.json();
    if (body.document) {
      project.design.document = body.document;
      project.updatedAt = new Date().toISOString();
      const { saveProject } = await import("@/lib/server/storage");
      await saveProject(project);
    }
    return NextResponse.json({ ok: true, project });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update" }, { status: 500 });
  }
}

