"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Code2, Download, MessageSquare, Monitor, Smartphone, Tablet } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { ComposingOverlay } from "./StudioHome";
import { ScaledMockup } from "@/components/renderer/Mockup";
import { getToken, saveSession, velt, type ProjectDetail } from "@/lib/api";
import { generateExportBundle } from "@/lib/exportBundle";

export function Editor({ id }: { id: string }) {
  const router = useRouter();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [stage, setStage] = useState("");
  const [pane, setPane] = useState<"preview" | "chat">("preview");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    async function init() {
      if (!getToken()) {
        if (active) router.replace("/login");
        return;
      }
      velt.project(id).then((p) => {
        if (active) setProject(p);
      }).catch(() => {
        if (active) router.replace("/studio");
      });
    }
    init();
    return () => {
      active = false;
    };
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

  function exportCode() {
    if (!project) return;
    const html = generateExportBundle(project.design.document);
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.title.replace(/\s+/g, "-").toLowerCase()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-paper">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col pt-14 lg:flex-row lg:pt-0">
        <section
          className={`relative min-w-0 flex-1 flex-col lg:flex ${
            pane === "preview" ? "flex" : "hidden"
          }`}
        >
          {busy ? <ComposingOverlay stage={stage} /> : null}
          <header className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-3 py-2.5 sm:px-5 sm:py-3">
            <div className="min-w-0">
              <div className="truncate font-display text-base leading-none sm:text-lg">
                {project?.title || "Draft"}
              </div>
              <div className="mt-1 text-[11px] uppercase tracking-[0.14em] text-muted">
                {project?.format} · v{project?.design.version ?? 1}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
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
                    aria-label={`${key} preview`}
                    className={`rounded-full p-1.5 ${device === key ? "bg-ink text-paper" : "text-muted"}`}
                  >
                    <Icon size={14} />
                  </button>
                ))}
              </div>
              <button
                onClick={exportCode}
                title="Download standalone HTML + Tailwind CSS (Ready for Shopify, WordPress, Wix, or Web)"
                className="flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-[12px] font-medium text-paper hover:opacity-90"
              >
                <Code2 size={13} />
                <span className="hidden sm:inline">Export Code</span>
                <span className="sm:hidden">Code</span>
              </button>
              <button
                onClick={exportJson}
                title="Export Velt JSON Specification"
                className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[12px] text-muted hover:text-ink"
              >
                <Download size={13} />
                <span className="hidden sm:inline">JSON</span>
              </button>
            </div>
          </header>
          <div className="flex flex-1 items-start justify-center overflow-auto bg-[linear-gradient(#d8d0c4_1px,transparent_1px),linear-gradient(90deg,#d8d0c4_1px,transparent_1px)] bg-[size:28px_28px] p-3 pb-16 sm:p-6 lg:p-8 lg:pb-8">
            {project ? (
              <div
                className={`relative isolate w-full overflow-hidden rounded-[24px] border border-line bg-paper frame-shadow ${
                  device === "mobile" ? "max-w-[402px]" : device === "tablet" ? "max-w-[900px]" : "max-w-[1440px]"
                }`}
              >
                <ScaledMockup
                  doc={project.design.document}
                  device={device}
                  fit="height"
                  maxScale={1}
                />
              </div>
            ) : (
              <p className="text-sm text-muted">Loading draft…</p>
            )}
          </div>
        </section>

        <aside
          className={`w-full shrink-0 flex-col border-line lg:flex lg:w-[340px] lg:border-l ${
            pane === "chat" ? "flex" : "hidden"
          }`}
        >
          <div className="hidden border-b border-line px-4 py-3 text-[12px] uppercase tracking-[0.16em] text-muted lg:block">
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
          {error ? <p className="px-4 pb-1 text-[12px] text-accent">{error}</p> : null}
          <form onSubmit={refine} className="border-t border-line p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
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

      {/* Mobile pane switcher */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex border-t border-line bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">
        <button
          onClick={() => setPane("preview")}
          className={`flex flex-1 items-center justify-center gap-2 py-3 text-[13px] font-medium ${
            pane === "preview" ? "text-ink" : "text-muted"
          }`}
        >
          <Monitor size={15} /> Preview
        </button>
        <button
          onClick={() => setPane("chat")}
          className={`flex flex-1 items-center justify-center gap-2 py-3 text-[13px] font-medium ${
            pane === "chat" ? "text-ink" : "text-muted"
          }`}
        >
          <MessageSquare size={15} /> Refine
        </button>
      </div>
    </div>
  );
}
