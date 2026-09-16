import { NextResponse } from "next/server";
import { getProject, saveProject } from "@/lib/server/storage";
import { refineWithOpenAI } from "@/lib/server/openai";

export async function POST(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params;
    const project = getProject(id);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const { message = "" } = await req.json();
    if (!message.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const refinedDoc = await refineWithOpenAI(project.design.document, message.trim());
    const now = new Date().toISOString();

    project.updatedAt = now;
    project.design = {
      id: `dsg_${Date.now()}`,
      version: (project.design.version || 1) + 1,
      prompt: message.trim(),
      document: refinedDoc,
      createdAt: now,
    };

    project.messages.push({
      id: `msg_u_${Date.now()}`,
      role: "user",
      content: message.trim(),
      createdAt: now,
    });

    project.messages.push({
      id: `msg_a_${Date.now()}`,
      role: "assistant",
      content: `Refined design according to "${message.trim()}".`,
      createdAt: now,
    });

    saveProject(project);

    return NextResponse.json({
      project,
      creditsRemaining: Math.max(0, (project.owner.credits || 50) - 1),
    });
  } catch (err) {
    console.error("Failed to refine design:", err);
    return NextResponse.json({ error: "Failed to refine design." }, { status: 500 });
  }
}
