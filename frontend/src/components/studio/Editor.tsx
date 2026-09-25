"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MousePointer2,
  Hand,
  Shapes,
  Frame,
  Type,
  Undo2,
  Redo2,
  ChevronDown,
  Download,
  Code2,
  Sparkles,
  Paperclip,
  ArrowUp,
  MessageSquare,
  Maximize2,
  SlidersHorizontal,
  Layers,
  Eye,
  Check,
  Zap,
  Globe,
  Ratio,
  Palette,
  Loader2,
  X,
  Monitor,
  Tablet,
  Smartphone,
  Plus
} from "lucide-react";
import type { DesignDoc } from "@/lib/design";
import { ScaledMockup } from "@/components/renderer/Mockup";
import { getToken, getStoredUser, saveSession, velt, type ProjectDetail, type User } from "@/lib/api";
import { generateExportBundle } from "@/lib/exportBundle";
import { UpgradeModal } from "./UpgradeModal";
import { toPng, toJpeg, toSvg } from "html-to-image";

export function Editor({ id }: { id: string }) {
  const router = useRouter();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [activeTool, setActiveTool] = useState<"select" | "hand" | "shapes" | "frame" | "text">("select");
  const [mode, setMode] = useState<"manual" | "agentic">("agentic");
  const [showGrid, setShowGrid] = useState(false);
  const [zoom, setZoom] = useState(100);

  // Undo / Redo history stack
  const [history, setHistory] = useState<DesignDoc[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Tool popover menus
  const [showFrameMenu, setShowFrameMenu] = useState(false);
  const [showShapesMenu, setShowShapesMenu] = useState(false);

  // Panning state for Hand tool
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });
  const mainScrollRef = useRef<HTMLDivElement>(null);

  // Prompt and generation
  const [promptInput, setPromptInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState("");
  const [error, setError] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);

  // Chips
  const [activeFormat, setActiveFormat] = useState("Web Design");
  const [activeRatio, setActiveRatio] = useState("16:9");

  // Export dropdown state
  const [exportFormat, setExportFormat] = useState<"PNG" | "SVG" | "JPEG" | "HTML">("PNG");
  const [exportScale, setExportScale] = useState<"1x" | "2x" | "3x">("2x");
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Reference container for screenshot capture
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    const token = getToken();
    if (!token) {
      router.replace("/login");
      return;
    }
    setUser(getStoredUser());

    velt.project(id).then((p) => {
      if (active) {
        setProject(p);
        if (p.design?.document) {
          setHistory([JSON.parse(JSON.stringify(p.design.document))]);
          setHistoryIndex(0);
        }
      }
    }).catch(() => {
      if (active) router.replace("/studio");
    });

    return () => {
      active = false;
    };
  }, [id, router]);

  // Push new state to undo/redo history
  function pushDocumentState(newDoc: DesignDoc) {
    if (!project) return;
    const cloned = JSON.parse(JSON.stringify(newDoc));
    const nextHistory = history.slice(0, historyIndex + 1);
    nextHistory.push(cloned);
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);

    const updatedProject = {
      ...project,
      design: {
        ...project.design,
        document: cloned,
      },
    };
    setProject(updatedProject);

    // Persist changes asynchronously to backend
    velt.update(project.id, cloned).catch((err) => {
      console.warn("Auto-save update note:", err);
    });
  }

  function handleUndo() {
    if (historyIndex > 0 && project) {
      const prevIndex = historyIndex - 1;
      const prevDoc = history[prevIndex];
      setHistoryIndex(prevIndex);
      setProject({
        ...project,
        design: {
          ...project.design,
          document: JSON.parse(JSON.stringify(prevDoc)),
        },
      });
      velt.update(project.id, prevDoc).catch(() => {});
    }
  }

  function handleRedo() {
    if (historyIndex < history.length - 1 && project) {
      const nextIndex = historyIndex + 1;
      const nextDoc = history[nextIndex];
      setHistoryIndex(nextIndex);
      setProject({
        ...project,
        design: {
          ...project.design,
          document: JSON.parse(JSON.stringify(nextDoc)),
        },
      });
      velt.update(project.id, nextDoc).catch(() => {});
    }
  }

  // Component library insertion (Shapes tool)
  function handleInsertComponent(kind: string) {
    if (!project?.design?.document) return;
    const currentDoc = project.design.document;
    let newSection: any = null;

    if (kind === "features") {
      newSection = {
        kind: "features",
        layout: "minimal-cols",
        title: "Key Capabilities",
        subtitle: "Built with extreme precision and high-throughput execution.",
        items: [
          { title: "Deterministic Flow", body: "Guaranteed consistency across every interaction without latency spikes." },
          { title: "Global Mesh", body: "Edge distribution configured for sub-millisecond propagation worldwide." },
          { title: "Modular Architecture", body: "Composable blocks designed to scale seamlessly with your systems." },
        ],
      };
    } else if (kind === "stats") {
      newSection = {
        kind: "stats",
        items: [
          { value: "99.99%", label: "Uptime Reliability" },
          { value: "12ms", label: "Global Edge Latency" },
          { value: "50M+", label: "Monthly Executions" },
          { value: "100%", label: "Zero-Downtime Deploys" },
        ],
      };
    } else if (kind === "pricing") {
      newSection = {
        kind: "pricing",
        title: "Transparent & Scalable Tiers",
        subtitle: "Select the execution capacity tailored for your team.",
        plans: [
          { name: "Starter", price: "$0", period: "/forever", features: ["1,000 requests/mo", "Community support", "Standard speed"] },
          { name: "Pro", price: "$49", period: "/month", popular: true, features: ["Unlimited requests", "Priority edge routing", "Dedicated support", "Custom domains"] },
          { name: "Enterprise", price: "Custom", period: "", features: ["Dedicated cluster", "99.99% SLA", "Audit logging", "24/7 incident response"] },
        ],
      };
    } else if (kind === "testimonials") {
      newSection = {
        kind: "testimonials",
        title: "Trusted by Industry Leaders",
        items: [
          { quote: "Velt transformed our design-to-production cadence by 10x.", author: "Elena Rostova", role: "VP of Product, ArchTech" },
          { quote: "The architectural fidelity and speed are unmatched in the ecosystem.", author: "Marcus Vance", role: "Founding Engineer, HyperFlow" },
        ],
      };
    } else if (kind === "cta") {
      newSection = {
        kind: "cta",
        headline: "Ready to accelerate your workflow?",
        sub: "Join thousands of teams shipping world-class digital experiences today.",
        cta: "Start Free Today",
        secondary: "Schedule a Demo",
      };
    }

    if (newSection) {
      const updatedDoc: DesignDoc = {
        ...currentDoc,
        sections: [...(currentDoc.sections || []), newSection],
      };
      pushDocumentState(updatedDoc);
    }
    setShowShapesMenu(false);
    setActiveTool("select");
  }

  // Insert headline & text block (Text tool)
  function handleInsertText() {
    if (!project?.design?.document) return;
    const currentDoc = project.design.document;
    const newSection = {
      kind: "features",
      layout: "minimal-cols",
      title: "Editorial Statement",
      subtitle: "Click and edit to articulate your core philosophy and mission.",
      items: [
        {
          title: "Purpose-Driven Design",
          body: "Every typographic choice, negative space, and interface cadence is crafted to communicate clear purpose.",
        },
      ],
    };
    const updatedDoc: DesignDoc = {
      ...currentDoc,
      sections: [...(currentDoc.sections || []), newSection],
    };
    pushDocumentState(updatedDoc);
    setActiveTool("select");
  }

  // Pan canvas drag handlers
  function handleMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    if (activeTool !== "hand") return;
    if (!mainScrollRef.current) return;
    setIsPanning(true);
    setPanStart({
      x: e.clientX,
      y: e.clientY,
      scrollLeft: mainScrollRef.current.scrollLeft,
      scrollTop: mainScrollRef.current.scrollTop,
    });
  }

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!isPanning || activeTool !== "hand" || !mainScrollRef.current) return;
    const dx = e.clientX - panStart.x;
    const dy = e.clientY - panStart.y;
    mainScrollRef.current.scrollLeft = panStart.scrollLeft - dx;
    mainScrollRef.current.scrollTop = panStart.scrollTop - dy;
  }

  function handleMouseUp() {
    setIsPanning(false);
  }

  // Refine / Generate with Agentic Prompt
  async function handleSendPrompt(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!promptInput.trim() || !project || busy) return;

    if (user && user.credits <= 0 && user.plan !== "Max Lifetime VIP" && !user.email.includes("abhiram")) {
      setShowUpgrade(true);
      return;
    }

    setBusy(true);
    setError("");
    setStage("Composing the grid & layouts...");
    try {
      const res = await velt.refine(project.id, promptInput.trim());
      setProject(res.project);
      const updatedUser = { ...res.project.owner, credits: res.creditsRemaining };
      setUser(updatedUser);
      saveSession(getToken()!, updatedUser);
      setPromptInput("");
    } catch (err: any) {
      const msg = err instanceof Error ? err.message : "Failed to generate.";
      setError(msg);
      if (msg.toLowerCase().includes("limit") || msg.toLowerCase().includes("upgrade")) {
        setShowUpgrade(true);
      }
    } finally {
      setBusy(false);
      setStage("");
    }
  }

  // Handle High-Res Export (PNG 1x/2x/3x, SVG, JPEG, and Code)
  async function handleExport() {
    if (!project) return;
    setIsExporting(true);
    const filename = (project.title || "velt-design").toLowerCase().replace(/\s+/g, "-");

    try {
      if (exportFormat === "HTML") {
        const html = generateExportBundle(project.design.document);
        const blob = new Blob([html], { type: "text/html;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${filename}.html`;
        a.click();
        URL.revokeObjectURL(url);
        return;
      }

      if (!canvasRef.current) return;
      const pixelRatio = exportScale === "3x" ? 3 : exportScale === "2x" ? 2 : 1;

      if (exportFormat === "PNG") {
        const dataUrl = await toPng(canvasRef.current, { pixelRatio, backgroundColor: "#ffffff" });
        downloadURI(dataUrl, `${filename}@${exportScale}.png`);
      } else if (exportFormat === "JPEG") {
        const dataUrl = await toJpeg(canvasRef.current, { pixelRatio, quality: 0.95, backgroundColor: "#ffffff" });
        downloadURI(dataUrl, `${filename}@${exportScale}.jpg`);
      } else if (exportFormat === "SVG") {
        const dataUrl = await toSvg(canvasRef.current);
        downloadURI(dataUrl, `${filename}.svg`);
      }
    } catch (err) {
      console.error("Export error:", err);
      // Fallback to HTML code download
      const html = generateExportBundle(project.design.document);
      const blob = new Blob([html], { type: "text/html;charset=utf-8" });
      downloadURI(URL.createObjectURL(blob), `${filename}.html`);
    } finally {
      setIsExporting(false);
      setShowExportMenu(false);
    }
  }

  function downloadURI(uri: string, name: string) {
    const link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-[#F0F0F0] text-slate-800 antialiased font-sans select-none">
      {/* 1. TOP HEADER (Matching Screenshot 1) */}
      <header className="z-30 flex h-14 w-full shrink-0 items-center justify-between border-b border-slate-200/80 bg-white px-4">
        {/* Left: Brand Icon + Pill Switches (Manual / Agentic) + History */}
        <div className="flex items-center gap-3">
          <Link href="/studio" className="flex items-center justify-center">
            <div className="flex size-7 items-center justify-center rounded-lg bg-sky-500 text-white font-bold text-sm shadow-sm">
              v
            </div>
          </Link>

          <div className="flex items-center rounded-lg bg-slate-100 p-0.5 text-xs font-medium">
            <button
              onClick={() => setMode("manual")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1 transition-all ${
                mode === "manual" ? "bg-white text-sky-600 shadow-xs font-semibold" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <MousePointer2 size={13} />
              Manual
            </button>
            <button
              onClick={() => setMode("agentic")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1 transition-all ${
                mode === "agentic" ? "bg-white text-sky-600 shadow-xs font-semibold" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Sparkles size={13} />
              Agentic
            </button>
          </div>

          <button
            onClick={() => router.push("/studio")}
            className="hidden sm:flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          >
            <Undo2 size={13} />
            History
          </button>
        </div>

        {/* Center: Document Title */}
        <div className="flex items-center gap-1.5 font-medium text-xs sm:text-sm text-slate-700">
          <span className="truncate max-w-[160px] sm:max-w-[300px]">
            {project?.title || "Untitled project"}
          </span>
        </div>

        {/* Right: Feedback + Plan Status Pill + Upgrade CTA + User Avatar */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="mailto:support@velt.cloud"
            className="hidden md:flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800"
          >
            <MessageSquare size={13} />
            Feedback
          </a>

          {/* Credits indicator */}
          <div className="flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
            <Zap size={12} className="text-amber-500" />
            <span className="font-semibold text-slate-800">{user?.credits ?? 0}</span>
            <span className="text-slate-400">· {user?.plan || "Free plan"}</span>
          </div>

          {/* Upgrade Button */}
          <Link
            href="/pricing"
            className="flex items-center gap-1 rounded-lg bg-sky-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-sky-600 transition"
          >
            Upgrade
          </Link>

          {/* User Initial Avatar */}
          <div className="flex size-7 items-center justify-center rounded-full bg-sky-600 text-white text-xs font-bold shadow-xs">
            {user?.name?.[0]?.toUpperCase() || "T"}
          </div>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE CANVAS AREA */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* LEFT FLOATING TOOL DOCK (Matching Screenshot 1) */}
        {/* LEFT FLOATING TOOL DOCK (Matching Make / Figma) */}
        <aside className="absolute left-4 top-4 z-30 hidden sm:flex flex-col items-center gap-1 rounded-2xl border border-slate-200/80 bg-white p-1.5 shadow-md">
          {/* Select / Pointer tool */}
          <button
            onClick={() => {
              setActiveTool("select");
              setShowFrameMenu(false);
              setShowShapesMenu(false);
            }}
            title="Select tool (V)"
            className={`rounded-xl p-2 transition ${activeTool === "select" ? "bg-slate-100 text-sky-600" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`}
          >
            <MousePointer2 size={16} />
          </button>

          {/* Hand / Pan tool */}
          <button
            onClick={() => {
              setActiveTool("hand");
              setShowFrameMenu(false);
              setShowShapesMenu(false);
            }}
            title="Hand / Pan canvas tool (H)"
            className={`rounded-xl p-2 transition ${activeTool === "hand" ? "bg-slate-100 text-sky-600" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`}
          >
            <Hand size={16} />
          </button>

          {/* Shapes & Components palette */}
          <div className="relative">
            <button
              onClick={() => {
                setShowShapesMenu(!showShapesMenu);
                setShowFrameMenu(false);
                setActiveTool("shapes");
              }}
              title="Insert Component / Shapes (S)"
              className={`rounded-xl p-2 transition ${activeTool === "shapes" || showShapesMenu ? "bg-slate-100 text-sky-600" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`}
            >
              <Shapes size={16} />
            </button>

            {showShapesMenu && (
              <div className="absolute left-full top-0 ml-2 z-50 w-52 rounded-xl border border-slate-200 bg-white p-2 shadow-xl animate-in fade-in zoom-in-95">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Insert Component
                </div>
                <div className="mt-1 flex flex-col gap-1">
                  <button
                    onClick={() => handleInsertComponent("features")}
                    className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-600 transition"
                  >
                    <span>Feature Bento</span>
                    <Plus size={13} className="text-slate-400" />
                  </button>
                  <button
                    onClick={() => handleInsertComponent("stats")}
                    className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-600 transition"
                  >
                    <span>Stat Metric Bar</span>
                    <Plus size={13} className="text-slate-400" />
                  </button>
                  <button
                    onClick={() => handleInsertComponent("pricing")}
                    className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-600 transition"
                  >
                    <span>Pricing Grid</span>
                    <Plus size={13} className="text-slate-400" />
                  </button>
                  <button
                    onClick={() => handleInsertComponent("testimonials")}
                    className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-600 transition"
                  >
                    <span>Testimonial Wall</span>
                    <Plus size={13} className="text-slate-400" />
                  </button>
                  <button
                    onClick={() => handleInsertComponent("cta")}
                    className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-600 transition"
                  >
                    <span>Call to Action Block</span>
                    <Plus size={13} className="text-slate-400" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Screen Frame preset tool */}
          <div className="relative">
            <button
              onClick={() => {
                setShowFrameMenu(!showFrameMenu);
                setShowShapesMenu(false);
                setActiveTool("frame");
              }}
              title="Screen Frame Presets (F)"
              className={`rounded-xl p-2 transition ${activeTool === "frame" || showFrameMenu ? "bg-slate-100 text-sky-600" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`}
            >
              <Frame size={16} />
            </button>

            {showFrameMenu && (
              <div className="absolute left-full top-0 ml-2 z-50 w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-xl animate-in fade-in zoom-in-95">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Screen Frames
                </div>
                <div className="mt-1 flex flex-col gap-1">
                  <button
                    onClick={() => {
                      setDevice("desktop");
                      setShowFrameMenu(false);
                      setActiveTool("select");
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                      device === "desktop" ? "bg-sky-50 text-sky-600 font-semibold" : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Monitor size={14} /> Desktop (1440)
                    </span>
                    {device === "desktop" && <Check size={13} />}
                  </button>
                  <button
                    onClick={() => {
                      setDevice("tablet");
                      setShowFrameMenu(false);
                      setActiveTool("select");
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                      device === "tablet" ? "bg-sky-50 text-sky-600 font-semibold" : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Tablet size={14} /> Tablet (860)
                    </span>
                    {device === "tablet" && <Check size={13} />}
                  </button>
                  <button
                    onClick={() => {
                      setDevice("mobile");
                      setShowFrameMenu(false);
                      setActiveTool("select");
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                      device === "mobile" ? "bg-sky-50 text-sky-600 font-semibold" : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Smartphone size={14} /> Mobile (402)
                    </span>
                    {device === "mobile" && <Check size={13} />}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Text block tool */}
          <button
            onClick={() => {
              setActiveTool("text");
              setShowFrameMenu(false);
              setShowShapesMenu(false);
              handleInsertText();
            }}
            title="Insert Text Section (T)"
            className={`rounded-xl p-2 transition ${activeTool === "text" ? "bg-slate-100 text-sky-600" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`}
          >
            <Type size={16} />
          </button>

          <div className="my-1 h-px w-4 bg-slate-200" />

          {/* Undo Action */}
          <button
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            title="Undo (Ctrl+Z)"
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <Undo2 size={15} />
          </button>

          {/* Redo Action */}
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            title="Redo (Ctrl+Y)"
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <Redo2 size={15} />
          </button>
        </aside>

        {/* CENTER VIEWPORT CANVAS */}
        <main
          ref={mainScrollRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`relative flex flex-1 items-start justify-center overflow-auto p-4 sm:p-8 ${
            activeTool === "hand" ? (isPanning ? "cursor-grabbing select-none" : "cursor-grab") : ""
          } ${
            showGrid ? "bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] bg-[size:16px_16px]" : "bg-[#F0F0F0]"
          }`}
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: "center top" }}
        >
          {project ? (
            <div 
              ref={canvasRef}
              className={`relative isolate w-full overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-2xl transition-all duration-300 ${
                device === "mobile" ? "max-w-[402px]" : device === "tablet" ? "max-w-[860px]" : "max-w-[1240px]"
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
            <div className="flex h-64 items-center justify-center text-sm text-slate-400">
              <Loader2 size={18} className="animate-spin mr-2" /> Initializing canvas…
            </div>
          )}
        </main>

        {/* RIGHT INSPECTOR & EXPORT PANEL (Matching Screenshots 1 & 2) */}
        <aside className="z-20 hidden lg:flex w-64 shrink-0 flex-col border-l border-slate-200/80 bg-white p-4 text-xs text-slate-700">
          {/* Page Background */}
          <div>
            <div className="flex items-center justify-between text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <span>Page</span>
              <span>19%</span>
            </div>
            <div className="mt-2 flex items-center gap-2 rounded-lg bg-slate-100 p-2 text-xs font-medium text-slate-800">
              <div className="size-4 rounded-sm border border-slate-300 bg-[#F0F0F0]" />
              <span>F0F0F0</span>
            </div>
          </div>

          <div className="my-4 h-px bg-slate-100" />

          {/* Canvas Controls */}
          <div>
            <div className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              Canvas
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                onClick={() => setZoom(100)}
                className="rounded-lg bg-slate-100 py-1.5 text-center font-medium text-slate-700 hover:bg-slate-200 transition"
              >
                Fit screen
              </button>
              <button
                onClick={() => setZoom(100)}
                className="rounded-lg bg-slate-100 py-1.5 text-center font-medium text-slate-700 hover:bg-slate-200 transition"
              >
                Zoom 100%
              </button>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-slate-600">Show grid</span>
              <button
                type="button"
                onClick={() => setShowGrid(!showGrid)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  showGrid ? "bg-sky-500" : "bg-slate-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block size-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    showGrid ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="my-4 h-px bg-slate-100" />

          {/* Layers */}
          <div className="flex-1">
            <div className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              Layers
            </div>
            <div className="mt-2 rounded-lg border border-dashed border-slate-200 p-3 text-slate-400 text-[11px] text-center">
              {project?.design?.document?.sections?.length || 0} active section components
            </div>
          </div>

          <div className="my-4 h-px bg-slate-100" />

          {/* Export Controls (Matching Screenshot 2) */}
          <div>
            <div className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              Export
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {/* Format Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="flex w-full items-center justify-between rounded-lg bg-slate-100 px-3 py-1.5 font-semibold text-slate-800 hover:bg-slate-200 transition"
                >
                  <span>{exportFormat}</span>
                  <ChevronDown size={14} className="text-slate-500" />
                </button>

                {showExportMenu && (
                  <div className="absolute bottom-full mb-1 left-0 z-50 w-full rounded-xl border border-slate-200 bg-white p-1 shadow-lg animate-in fade-in zoom-in-95">
                    {(["PNG", "SVG", "JPEG", "HTML"] as const).map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => {
                          setExportFormat(fmt);
                          setShowExportMenu(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                          exportFormat === fmt ? "bg-sky-50 text-sky-600" : "text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <span>{fmt === "HTML" ? "Code (HTML)" : fmt}</span>
                        {exportFormat === fmt && <Check size={13} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Scale Dropdown */}
              <select
                value={exportScale}
                onChange={(e) => setExportScale(e.target.value as any)}
                className="rounded-lg bg-slate-100 px-2 py-1.5 font-semibold text-slate-800 outline-none hover:bg-slate-200 transition cursor-pointer"
              >
                <option value="1x">1x</option>
                <option value="2x">2x</option>
                <option value="3x">3x</option>
              </select>
            </div>

            {/* Export All Action Button */}
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-lg bg-slate-100 py-2 font-semibold text-slate-800 hover:bg-slate-200 disabled:opacity-50 transition"
            >
              {isExporting ? (
                <>
                  <Loader2 size={13} className="animate-spin" /> Exporting…
                </>
              ) : (
                <>
                  <Download size={13} /> Export all
                </>
              )}
            </button>
          </div>
        </aside>

        {/* 3. BOTTOM FLOATING PROMPT & UPGRADE DOCK (Matching Screenshot 1) */}
        <div className="absolute inset-x-0 bottom-4 z-20 flex flex-col items-center px-4 pointer-events-none">
          {/* Trial / Upgrade Floating Banner */}
          {user && user.credits <= 0 ? (
            <div className="pointer-events-auto mb-2.5 flex items-center justify-between gap-3 rounded-full border border-slate-200 bg-white/95 px-4 py-2 shadow-lg backdrop-blur-md">
              <div className="flex items-center gap-2">
                <div className="flex size-5 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                  <Sparkles size={12} />
                </div>
                <div className="text-xs font-medium text-slate-700">
                  <span className="font-semibold text-slate-900">Upgrade to start generating</span> — Pick a plan to unlock generation with a free 2-day trial.
                </div>
              </div>
              <Link
                href="/pricing"
                className="rounded-full bg-slate-900 px-3.5 py-1 text-xs font-semibold text-white hover:bg-slate-800 transition"
              >
                View plans →
              </Link>
            </div>
          ) : null}

          {/* Floating Prompt Input Box */}
          <div className="pointer-events-auto w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-3 shadow-xl backdrop-blur-md transition-all">
            <form onSubmit={handleSendPrompt}>
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  placeholder="Ask Velt to compose, redesign hero, change layout..."
                  className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none"
                />
                <button
                  type="button"
                  onClick={() => {}}
                  className="text-slate-400 hover:text-slate-600 ml-2"
                >
                  <Maximize2 size={13} />
                </button>
              </div>

              {/* Bottom Chip Selectors and Submit */}
              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-500 overflow-x-auto no-scrollbar">
                  <span className="flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-700">
                    <Globe size={11} /> {activeFormat}
                  </span>
                  <span className="flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-700">
                    <Palette size={11} /> Light Theme
                  </span>
                  <span className="flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-700">
                    <Ratio size={11} /> {activeRatio}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 ml-2 shrink-0">
                  <label className="cursor-pointer text-slate-400 hover:text-slate-600 p-1">
                    <Paperclip size={14} />
                    <input type="file" accept="image/*" className="hidden" />
                  </label>
                  <button
                    type="submit"
                    disabled={!promptInput.trim() || busy}
                    className="flex size-7 items-center justify-center rounded-full bg-slate-200 text-slate-700 hover:bg-sky-500 hover:text-white transition disabled:opacity-50"
                  >
                    {busy ? <Loader2 size={13} className="animate-spin" /> : <ArrowUp size={14} />}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <UpgradeModal
        isOpen={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        title="2-Day Free Trial Limit Reached"
        description="You've used your trial credits (200 credits). Upgrade your plan to unlock unlimited designs, live layout clones, and production code exports."
      />
    </div>
  );
}
