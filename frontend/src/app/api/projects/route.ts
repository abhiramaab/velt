import { NextResponse } from "next/server";
import { getProjectSummaries, saveProject, DEMO_USER } from "@/lib/server/storage";
import { generateWithOpenAI } from "@/lib/server/openai";
import type { ProjectDetail } from "@/lib/api";

export async function GET() {
  return NextResponse.json(getProjectSummaries());
}

export async function POST(req: Request) {
  try {
    const { prompt = "", format = "website" } = await req.json();
    if (!prompt.trim()) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const designDoc = await generateWithOpenAI(prompt.trim(), format);
    const id = `proj_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const now = new Date().toISOString();

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
      owner: DEMO_USER,
    };

    saveProject(project);

    return NextResponse.json({
      project,
      creditsRemaining: Math.max(0, DEMO_USER.credits - 1),
    });
  } catch (err) {
    console.error("Failed to compose project:", err);
    return NextResponse.json({ error: "Failed to generate design." }, { status: 500 });
  }
}
