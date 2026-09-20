import type { DesignDoc } from "./design";

// Always use relative URLs in the browser so requests stay on the same origin (HTTPS)
export const API_URL =
  typeof window !== "undefined"
    ? ""
    : process.env.NEXT_PUBLIC_API_URL || "";

export type User = {
  id: string;
  name: string;
  email: string;
  plan: string;
  credits: number;
};

export type ProjectSummary = {
  id: string;
  title: string;
  format: string;
  prompt: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  preview: DesignDoc;
};

export type Message = {
  id: string;
  role: string;
  content: string;
  createdAt: string;
};

export type ProjectDetail = {
  id: string;
  title: string;
  format: string;
  prompt: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  design: { id: string; version: number; prompt: string; document: DesignDoc; createdAt: string };
  messages: Message[];
  owner: User;
};

const TOKEN_KEY = "velt_token";
const USER_KEY = "velt_user";

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function saveSession(token: string, user: User) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (res.status === 401) {
    clearSession();
    throw new Error("Please sign in again.");
  }
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      message = body.error || message;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const velt = {
  login: (email: string, password: string) =>
    api<{ token: string; user: User }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  register: (name: string, email: string, password: string) =>
    api<{ token: string; user: User }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),
  me: () => api<User>("/api/me"),
  projects: () => api<ProjectSummary[]>("/api/projects"),
  showcase: () => api<ProjectSummary[]>("/api/showcase"),
  project: (id: string) => api<ProjectDetail>(`/api/projects/${id}`),
  create: (prompt: string, format: string, imageUrl?: string) =>
    api<{ project: ProjectDetail; creditsRemaining: number }>("/api/projects", {
      method: "POST",
      body: JSON.stringify({ prompt, format, imageUrl }),
    }),
  refine: (id: string, message: string) =>
    api<{ project: ProjectDetail; creditsRemaining: number }>(`/api/projects/${id}/refine`, {
      method: "POST",
      body: JSON.stringify({ message }),
    }),
};
