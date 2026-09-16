import type { ProjectDetail, ProjectSummary, User } from "../api";
import type { DesignDoc } from "../design";
import { SAMPLES } from "../samples";

export const DEMO_USER: User = {
  id: "usr_demo",
  name: "Studio Member",
  email: "creator@velt.design",
  plan: "Pro Studio",
  credits: 50,
};

// Global in-memory storage for serverless runtime
declare global {
  // eslint-disable-next-line no-var
  var __velt_projects: Map<string, ProjectDetail> | undefined;
}

if (!globalThis.__velt_projects) {
  globalThis.__velt_projects = new Map<string, ProjectDetail>();
  // Seed with sample projects
  for (let i = 0; i < SAMPLES.length; i++) {
    const s = SAMPLES[i];
    const id = `proj_sample_${i + 1}`;
    globalThis.__velt_projects.set(id, {
      id,
      title: s.name,
      format: s.format,
      prompt: s.tagline || s.name,
      status: "ready",
      createdAt: new Date(Date.now() - (i + 1) * 3600000).toISOString(),
      updatedAt: new Date().toISOString(),
      design: {
        id: `dsg_${i + 1}`,
        version: 1,
        prompt: s.tagline || s.name,
        document: s,
        createdAt: new Date().toISOString(),
      },
      messages: [
        {
          id: `msg_${i + 1}`,
          role: "assistant",
          content: "Composed initial design based on your brief.",
          createdAt: new Date().toISOString(),
        },
      ],
      owner: DEMO_USER,
    });
  }
}

export const projectStore = globalThis.__velt_projects!;

export function getProjectSummaries(): ProjectSummary[] {
  return Array.from(projectStore.values()).map((p) => ({
    id: p.id,
    title: p.title,
    format: p.format,
    prompt: p.prompt,
    status: p.status,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    preview: p.design.document,
  }));
}

export function getProject(id: string): ProjectDetail | undefined {
  return projectStore.get(id);
}

export function saveProject(project: ProjectDetail) {
  projectStore.set(project.id, project);
}
