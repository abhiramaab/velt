"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { FORMATS, SAMPLE_PROMPTS } from "@/lib/design";
import { getToken, saveSession, velt, type ProjectSummary, type User } from "@/lib/api";
import { PrototypeRenderer } from "@/components/renderer/PrototypeRenderer";

export function StudioHome() {
  const router = useRouter();
  const params = useSearchParams();
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [prompt, setPrompt] = useState(params.get("prompt") || "");
  const [format, setFormat] = useState(params.get("format") || "website");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [stage, setStage] = useState("");

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    velt.me().then((u) => {
      setUser(u);
      saveSession(getToken()!, u);
    }).catch(() => router.replace("/login"));
    velt.projects().then(setProjects).catch(() => setProjects([]));
  }, [router]);

  async function compose() {
    if (!prompt.trim()) return;
    setBusy(true);
    setError("");
    const stages = ["Setting type", "Mixing a palette", "Composing the grid", "Writing the close"];
    let i = 0;
    setStage(stages[0]);
    const tick = setInterval(() => {
      i = (i + 1) % stages.length;
      setStage(stages[i]);
    }, 700);
    try {
      const res = await velt.create(prompt.trim(), format);
      saveSession(getToken()!, { ...res.project.owner, credits: res.creditsRemaining });
      router.push(`/studio/${res.project.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not compose.");
    } finally {
      clearInterval(tick);
      setBusy(false);
      setStage("");
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-paper">
      <Sidebar />
      <div className="relative flex min-w-0 flex-1 flex-col overflow-y-auto">
        {busy ? <ComposingOverlay stage={stage} /> : null}
        <div className="mx-auto w-full max-w-4xl px-8 py-10">
          <p className="text-[12px] uppercase tracking-[0.2em] text-muted">New composition</p>
          <h1 className="font-display mt-2 text-4xl tracking-tight">What are we making?</h1>
          <div className="prompt-ring mt-6 rounded-[28px] border border-line bg-paper-2 p-4">
            <div className="mb-3 flex flex-wrap gap-1.5">
              {FORMATS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFormat(f.id)}
                  className={`rounded-full px-3 py-1 text-[11px] ${
                    format === f.id ? "bg-ink text-paper" : "text-muted hover:text-ink"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              placeholder="A quiet ceramic studio in Kyoto. Wabi-sabi, paper, warm clay."
              className="w-full resize-none bg-transparent text-[15px] outline-none"
            />
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[12px] text-muted">{user ? `${user.credits} credits · 2 to compose` : ""}</span>
              <button
                onClick={compose}
                disabled={busy}
                className="rounded-full bg-accent px-5 py-2 text-sm text-white disabled:opacity-60"
              >
                Compose
              </button>
            </div>
          </div>
          {error ? <p className="mt-3 text-sm text-accent">{error}</p> : null}
          <div className="mt-4 flex flex-wrap gap-2">
            {SAMPLE_PROMPTS.slice(0, 3).map((s) => (
              <button
                key={s}
                onClick={() => setPrompt(s)}
                className="rounded-full border border-line px-3 py-1 text-[11px] text-muted hover:text-ink"
              >
                {s.split(".")[0]}
              </button>
            ))}
          </div>

          <h2 className="mt-14 font-display text-2xl">Your drafts</h2>
          {projects.length === 0 ? (
            <p className="mt-3 text-sm text-muted">Nothing yet. Write a sentence above.</p>
          ) : (
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {projects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => router.push(`/studio/${p.id}`)}
                  className="overflow-hidden rounded-[22px] border border-line bg-paper-2 text-left"
                >
                  <div className="h-[150px] overflow-hidden">
                    <div className="origin-top-left scale-[0.28]" style={{ width: 1280 }}>
                      <PrototypeRenderer doc={p.preview} />
                    </div>
                  </div>
                  <div className="px-4 py-3">
                    <div className="flex items-center justify-between">
                      <span className="font-display text-lg">{p.title}</span>
                      <span className="text-[10px] uppercase tracking-[0.14em] text-muted">{p.format}</span>
                    </div>
                    <p className="mt-1 line-clamp-1 text-[12px] text-muted">{p.prompt}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ComposingOverlay({ stage }: { stage: string }) {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-paper/80 backdrop-blur-sm">
      <div className="text-center">
        <div className="mx-auto mb-5 flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-2 w-2 rounded-full bg-accent"
              style={{ animation: `pulse-dot 1s ${i * 0.18}s ease-in-out infinite` }}
            />
          ))}
        </div>
        <p className="font-display text-2xl italic">{stage || "Composing"}</p>
        <p className="mt-2 text-sm text-muted">Type, color, and a close — in that order.</p>
      </div>
    </div>
  );
}
