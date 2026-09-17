import { NextResponse } from "next/server";
import { getProjectSummaries, saveProject } from "@/lib/server/storage";
import { generateWithOpenAI } from "@/lib/server/openai";
import { extractAuthUser } from "@/lib/server/jwt";
import type { ProjectDetail, User } from "@/lib/api";

export async function GET(req: Request) {
  const authUser = extractAuthUser(req);
  if (!authUser) {
    return NextResponse.json({ error: "Unauthorized: Valid JWT required." }, { status: 401 });
  }

  const summaries = await getProjectSummaries();
  return NextResponse.json(summaries);
}

export async function POST(req: Request) {
  try {
    const authUser = extractAuthUser(req);
    if (!authUser) {
      return NextResponse.json(
        { error: "Unauthorized: You must be logged in with a valid JWT to generate designs." },
        { status: 401 }
      );
    }

    const { prompt = "", format = "website" } = await req.json();
    if (!prompt.trim()) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const designDoc = await generateWithOpenAI(prompt.trim(), format);
    const id = `proj_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const now = new Date().toISOString();

    const currentUser: User = {
      id: authUser.sub,
      name: authUser.name || authUser.email.split("@")[0] || "Creator",
      email: authUser.email,
      plan: "Pro Studio",
      credits: 50,
    };

    const project: ProjectDetail = {
      id,
      title: designDoc.name || "Draft Composition",
      format,
      prompt: prompt.trim(),
      status: "ready",
      createdAt: now,
      updatedAt: now,
      design: {
        id: `dsg_${Date.now()}`,
        version: 1,
        prompt: prompt.trim(),
        document: designDoc,
        createdAt: now,
      },
      messages: [
        {
          id: `msg_${Date.now()}`,
          role: "assistant",
          content: `Composed initial ${format} layout for "${designDoc.name}".`,
          createdAt: now,
        },
      ],
      owner: currentUser,
    };

    await saveProject(project);

    return NextResponse.json({
      project,
      creditsRemaining: Math.max(0, currentUser.credits - 1),
    });
  } catch (err) {
    console.error("Failed to compose project:", err);
    return NextResponse.json({ error: "Failed to generate design." }, { status: 500 });
  }
}
