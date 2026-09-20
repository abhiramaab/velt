"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { FORMATS, SAMPLE_PROMPTS } from "@/lib/design";
import { getToken, saveSession, velt, type ProjectSummary, type User } from "@/lib/api";
import { ScaledMockup } from "@/components/renderer/Mockup";

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
    let active = true;
    async function init() {
      const token = getToken();
      if (!token) {
        const q = window.location.search || "";
        if (active) router.replace(`/login${q}`);
        return;
      }
      velt.me().then((u) => {
        if (active) {
          setUser(u);
          saveSession(token, u);
        }
      }).catch(() => {
        if (active) {
          const q = window.location.search || "";
          router.replace(`/login${q}`);
        }
      });

      velt.projects().then((p) => {
        if (active) setProjects(p);
      }).catch(() => {
        if (active) setProjects([]);
      });

      const qPrompt = params.get("prompt");
      const qFormat = params.get("format") || "website";
      if (qPrompt && qPrompt.trim()) {
        composeWith(qPrompt.trim(), qFormat);
      }
    }
    init();
    return () => {
      active = false;
    };
  }, []);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Please drop or select an image file (PNG, JPG, WebP).");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === "string") {
        setImagePreview(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  }

  const [referenceUrl, setReferenceUrl] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);

  async function composeWith(text: string, fmt: string, img?: string | null, refUrl?: string | null) {
    if (!text.trim() && !img && !refUrl) return;
    setBusy(true);
    setError("");
    const stages = refUrl
      ? ["Inspecting reference site...", "Extracting typography & visual DNA...", "Analyzing hero & layout hierarchy...", "Composing the grid"]
      : img
      ? ["Analyzing reference image...", "Discovering layout & medium...", "Mixing palette from visual DNA...", "Composing the grid"]
      : ["Consulting ChatGPT", "Setting type", "Mixing a palette", "Composing the grid"];
    let i = 0;
    setStage(stages[0]);
    const tick = setInterval(() => {
      i = (i + 1) % stages.length;
      setStage(stages[i]);
    }, 700);
    try {
      const res = await velt.create(
        text.trim() || (refUrl ? `Design a site inspired by ${refUrl}` : "Design this reference for me."),
        fmt,
        img || undefined,
        refUrl || undefined
      );
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

  async function compose() {
    await composeWith(prompt, format, imagePreview, referenceUrl);
  }

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-paper">
      <Sidebar />
      <div className="relative flex min-w-0 flex-1 flex-col overflow-y-auto pt-14 lg:pt-0">
        {busy ? <ComposingOverlay stage={stage} /> : null}
        <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-8 sm:py-10">
          <p className="text-[12px] uppercase tracking-[0.2em] text-muted">New composition</p>
          <h1 className="font-display mt-2 text-3xl tracking-tight sm:text-4xl">What are we making?</h1>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`prompt-ring mt-6 rounded-2xl border transition-all ${
              isDragging ? "border-accent bg-accent/5 ring-2 ring-accent/30" : "border-line bg-paper-2"
            } p-3.5 sm:rounded-[28px] sm:p-4`}
          >
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1.5">
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
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setShowUrlInput((prev) => !prev)}
                  className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition ${
                    referenceUrl || showUrlInput
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-line bg-paper text-muted hover:border-ink hover:text-ink"
                  }`}
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <span>{referenceUrl ? "Reference URL set" : "Add reference URL"}</span>
                </button>
                <label className="flex cursor-pointer items-center gap-1.5 rounded-full border border-line bg-paper px-2.5 py-1 text-[11px] font-medium text-muted transition hover:border-ink hover:text-ink">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  <span>Attach image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFile(e.target.files[0]);
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            {showUrlInput && (
              <div className="mb-3 flex items-center gap-2 rounded-xl border border-line bg-paper px-3 py-2">
                <svg className="h-4 w-4 text-muted shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <input
                  type="text"
                  value={referenceUrl}
                  onChange={(e) => setReferenceUrl(e.target.value)}
                  placeholder="Paste reference site (e.g. shipper.now, linear.app, stripe.com)"
                  className="flex-1 bg-transparent text-xs text-ink placeholder:text-muted outline-none"
                  autoFocus
                />
                {referenceUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setReferenceUrl("");
                      setShowUrlInput(false);
                    }}
                    className="rounded-full p-1 text-muted hover:text-ink"
                    title="Clear URL"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            )}

            {imagePreview && (
              <div className="mb-3 flex items-center gap-3 rounded-xl border border-line bg-paper p-2">
                <img src={imagePreview} alt="Reference preview" className="h-12 w-12 rounded-lg object-cover border border-line" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-ink">Reference Attached</p>
                  <p className="text-[11px] text-muted truncate">AI will discover the format (poster, web, app) & palette</p>
                </div>
                <button
                  type="button"
                  onClick={() => setImagePreview(null)}
                  className="rounded-full p-1 text-muted hover:bg-paper-2 hover:text-ink"
                  title="Remove image"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              placeholder={imagePreview ? "Design like this reference for me. Keep the visual rhythm and feel..." : "A quiet ceramic studio in Kyoto. Wabi-sabi, paper, warm clay."}
              className="w-full resize-none bg-transparent text-[15px] outline-none"
            />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[12px] text-muted">
                {user ? `${user.credits} credits · 2 to compose` : ""}
                {isDragging && <span className="ml-2 text-accent font-medium">Drop screenshot to attach</span>}
              </span>
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
            <div className="mt-5 grid gap-4 sm:grid-cols-2 sm:gap-5">
              {projects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => router.push(`/studio/${p.id}`)}
                  className="overflow-hidden rounded-[22px] border border-line bg-paper-2 text-left transition hover:border-accent/40"
                >
                  <div className="relative isolate aspect-[16/10] overflow-hidden bg-paper-2">
                    <div className="pointer-events-none absolute inset-0">
                      <ScaledMockup doc={p.preview} fit="width" maxScale={0.4} />
                    </div>
                  </div>
                  <div className="px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="truncate font-display text-lg">{p.title}</span>
                      <span className="shrink-0 text-[10px] uppercase tracking-[0.14em] text-muted">{p.format}</span>
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
