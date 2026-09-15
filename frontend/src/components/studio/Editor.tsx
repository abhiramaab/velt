"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Monitor, Smartphone, Tablet } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { ComposingOverlay } from "./StudioHome";
import { PrototypeRenderer } from "@/components/renderer/PrototypeRenderer";
import { getToken, saveSession, velt, type ProjectDetail } from "@/lib/api";

export function Editor({ id }: { id: string }) {
  const router = useRouter();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [stage, setStage] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    velt.project(id).then(setProject).catch(() => router.replace("/studio"));
  }, [id, router]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [project?.messages.length]);

  async function refine(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim() || !project) return;
    setBusy(true);
    setError("");
    setStage("Listening, then moving type");
    try {
      const res = await velt.refine(project.id, message.trim());
      setProject(res.project);
      saveSession(getToken()!, { ...res.project.owner, credits: res.creditsRemaining });
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not refine.");
    } finally {
      setBusy(false);
      setStage("");
    }
  }

  function exportJson() {
    if (!project) return;
    const blob = new Blob([JSON.stringify(project.design.document, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.title.replace(/\s+/g, "-").toLowerCase()}.velt.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const width = device === "mobile" ? 390 : device === "tablet" ? 768 : 1280;
  const scale = device === "mobile" ? 0.82 : device === "tablet" ? 0.62 : 0.58;

  return (
    <div className="flex h-screen overflow-hidden bg-paper">
      <Sidebar />
      <div className="flex min-w-0 flex-1">
        <section className="relative flex min-w-0 flex-1 flex-col">
          {busy ? <ComposingOverlay stage={stage} /> : null}
          <header className="flex items-center justify-between border-b border-line px-5 py-3">
            <div>
              <div className="font-display text-lg leading-none">{project?.title || "Draft"}</div>
              <div className="mt-1 text-[11px] uppercase tracking-[0.14em] text-muted">
                {project?.format} · v{project?.design.version ?? 1}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex rounded-full border border-line p-1">
                {(
                  [
                    ["desktop", Monitor],
                    ["tablet", Tablet],
                    ["mobile", Smartphone],
                  ] as const
                ).map(([key, Icon]) => (
                  <button
                    key={key}
                    onClick={() => setDevice(key)}
                    className={`rounded-full p-1.5 ${device === key ? "bg-ink text-paper" : "text-muted"}`}
                  >
                    <Icon size={14} />
                  </button>
                ))}
              </div>
              <button onClick={exportJson} className="rounded-full border border-line px-3 py-1.5 text-[12px]">
                Export
              </button>
            </div>
          </header>
          <div className="flex flex-1 items-start justify-center overflow-auto bg-[linear-gradient(#d8d0c4_1px,transparent_1px),linear-gradient(90deg,#d8d0c4_1px,transparent_1px)] bg-[size:28px_28px] p-8">
            {project ? (
              <div
                className="frame-shadow overflow-hidden rounded-[20px] border border-line bg-paper"
                style={{ width: width * scale, height: device === "mobile" ? 720 * 0.82 : undefined }}
              >
                <div className="origin-top-left" style={{ width, transform: `scale(${scale})` }}>
                  <PrototypeRenderer doc={project.design.document} />
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted">Loading draft…</p>
            )}
          </div>
        </section>

        <aside className="flex w-[340px] shrink-0 flex-col border-l border-line">
          <div className="border-b border-line px-4 py-3 text-[12px] uppercase tracking-[0.16em] text-muted">
            Refine in conversation
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {project?.messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[90%] rounded-2xl px-3 py-2 text-[13px] leading-relaxed ${
                    m.role === "user" ? "bg-ink text-paper" : "border border-line bg-paper-2"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>
          {error ? <p className="px-4 text-[12px] text-accent">{error}</p> : null}
          <form onSubmit={refine} className="border-t border-line p-3">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="Make it darker. Shorter headline. Add pricing."
              className="w-full resize-none rounded-2xl border border-line bg-paper-2 px-3 py-2 text-sm outline-none"
            />
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[11px] text-muted">1 credit</span>
              <button disabled={busy} className="rounded-full bg-ink px-4 py-1.5 text-[12px] text-paper disabled:opacity-60">
                Apply
              </button>
            </div>
          </form>
        </aside>
      </div>
    </div>
  );
}
