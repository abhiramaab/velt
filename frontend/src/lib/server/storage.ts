import { createClient } from "@supabase/supabase-js";
import type { ProjectDetail, ProjectSummary, User } from "../api";
import { SAMPLES } from "../samples";

export const DEMO_USER: User = {
  id: "usr_demo",
  name: "Studio Member",
  email: "creator@velt.design",
  plan: "Pro Studio",
  credits: 50,
};

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// Global in-memory fallback for offline or unconfigured environments
declare global {
  // eslint-disable-next-line no-var
  var __velt_projects: Map<string, ProjectDetail> | undefined;
}

function getSampleProjects(): ProjectDetail[] {
  return SAMPLES.map((s, i) => {
    const id = `proj_sample_${i + 1}`;
    const now = new Date(Date.now() - (i + 1) * 3600000).toISOString();
    return {
      id,
      title: s.name,
      format: s.format,
      prompt: s.tagline || s.name,
      status: "ready",
      createdAt: now,
      updatedAt: now,
      design: {
        id: `dsg_${i + 1}`,
        version: 1,
        prompt: s.tagline || s.name,
        document: s,
        createdAt: now,
      },
      messages: [
        {
          id: `msg_${i + 1}`,
          role: "assistant",
          content: "Composed initial design based on your brief.",
          createdAt: now,
        },
      ],
      owner: DEMO_USER,
    };
  });
}

if (!globalThis.__velt_projects) {
  globalThis.__velt_projects = new Map<string, ProjectDetail>();
  for (const p of getSampleProjects()) {
    globalThis.__velt_projects.set(p.id, p);
  }
}

export const projectStore = globalThis.__velt_projects!;

// Helper to convert database row to ProjectDetail
function mapRowToProject(row: any): ProjectDetail {
  return {
    id: row.id,
    title: row.title,
    format: row.format,
    prompt: row.prompt || "",
    status: row.status || "ready",
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
    updatedAt: row.updated_at || row.updatedAt || new Date().toISOString(),
    design: row.design || {},
    messages: Array.isArray(row.messages) ? row.messages : [],
    owner: row.owner || DEMO_USER,
  };
}

export async function getProjectSummaries(): Promise<ProjectSummary[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((row) => ({
          id: row.id,
          title: row.title,
          format: row.format,
          prompt: row.prompt || "",
          status: row.status || "ready",
          createdAt: row.created_at,
          updatedAt: row.updated_at,
          preview: row.design?.document,
        }));
      }

      // If Supabase is empty, seed sample projects into Supabase
      if (!error && data && data.length === 0) {
        const samples = getSampleProjects();
        await Promise.all(samples.map((p) => saveProject(p)));
        return samples.map((p) => ({
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
    } catch (err) {
      console.error("Failed to query Supabase projects, using fallback:", err);
    }
  }

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

export async function getProject(id: string): Promise<ProjectDetail | undefined> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (!error && data) {
        const project = mapRowToProject(data);
        projectStore.set(project.id, project);
        return project;
      }
    } catch (err) {
      console.error("Failed to fetch project from Supabase:", err);
    }
  }

  return projectStore.get(id);
}

export async function saveProject(project: ProjectDetail): Promise<void> {
  projectStore.set(project.id, project);

  if (supabase) {
    try {
      const { error } = await supabase.from("projects").upsert({
        id: project.id,
        title: project.title,
        format: project.format,
        prompt: project.prompt,
        status: project.status,
        created_at: project.createdAt,
        updated_at: project.updatedAt,
        design: project.design,
        messages: project.messages,
        owner: project.owner,
      });

      if (error) {
        console.error("Failed to upsert project to Supabase:", error);
      }
    } catch (err) {
      console.error("Error saving project to Supabase:", err);
    }
  }
}
