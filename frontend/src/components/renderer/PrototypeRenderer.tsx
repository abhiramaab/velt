"use client";

import type { DesignDoc, Section, Theme } from "@/lib/design";

type Props = {
  doc: DesignDoc;
  className?: string;
  device?: "desktop" | "tablet" | "mobile";
};

export function PrototypeRenderer({ doc, className = "", device = "desktop" }: Props) {
  const theme = doc.theme;
  const format = doc.format || "website";
  const isPhone = format === "app" || format === "story";
  const framed = new Set(["poster", "social", "facebook", "instagram", "youtube", "story", "banner", "pitch", "email"]);
  const isPoster = framed.has(format);
  const radius = isPhone ? "36px" : isPoster ? "8px" : "0px";

  return (
    <div
      className={`velt-proto overflow-hidden ${className}`}
      style={{
        background: theme.bg,
        color: theme.fg,
        fontFamily:
          theme.fontDisplay === "serif"
            ? "var(--font-fraunces), Fraunces, serif"
            : "var(--font-figtree), Figtree, sans-serif",
        borderRadius: radius,
        ["--r" as string]: theme.radius || "16px",
      }}
    >
      {doc.nav && !isPhone && !isPoster && format !== "dashboard" && format !== "brand" && (
        <NavBar nav={doc.nav} theme={theme} isMobile={device === "mobile"} />
      )}
      {doc.sections?.map((section, i) => (
        <Block key={`${section.kind}-${i}`} section={section} theme={theme} doc={doc} isMobile={device === "mobile"} />
      ))}
    </div>
  );
}

function NavBar({
  nav,
  theme,
  isMobile,
}: {
  nav: NonNullable<DesignDoc["nav"]>;
  theme: Theme;
  isMobile?: boolean;
}) {
  return (
    <div
      className="flex items-center justify-between px-6 sm:px-8 py-4 sm:py-5 text-[11px] tracking-[0.18em] uppercase"
      style={{ borderBottom: `1px solid ${theme.line}` }}
    >
      <div className="text-[14px] sm:text-[15px] normal-case tracking-normal font-medium truncate max-w-[200px]">
        {nav.logo}
      </div>
      {!isMobile && (
        <div className="hidden sm:flex gap-6" style={{ color: theme.muted }}>
          {nav.links?.map((link) => (
            <span key={link}>{link}</span>
          ))}
        </div>
      )}
      <span
        className="px-3 py-1.5 text-[10px] shrink-0 font-medium"
        style={{
          background: theme.fg,
          color: theme.bg,
          borderRadius: "999px",
        }}
      >
        {nav.cta}
      </span>
    </div>
  );
}

function Block({
  section,
  theme,
  doc,
  isMobile,
}: {
  section: Section;
  theme: Theme;
  doc: DesignDoc;
  isMobile?: boolean;
}) {
  switch (section.kind) {
    case "hero":
      return <Hero section={section} theme={theme} isMobile={isMobile} />;
    case "stats":
      return <Stats section={section} theme={theme} isMobile={isMobile} />;
    case "features":
      return <Features section={section} theme={theme} isMobile={isMobile} />;
    case "gallery":
      return <Gallery section={section} theme={theme} isMobile={isMobile} />;
    case "testimonials":
      return <Testimonials section={section} theme={theme} isMobile={isMobile} />;
    case "pricing":
      return <Pricing section={section} theme={theme} isMobile={isMobile} />;
    case "cta":
      return <Cta section={section} theme={theme} />;
    case "footer":
      return <Footer section={section} theme={theme} />;
    case "poster":
      return <Poster section={section} theme={theme} />;
    case "social":
      return <Social section={section} theme={theme} />;
    case "facebook":
      return <FacebookAd section={section} theme={theme} />;
    case "instagram":
      return <InstagramPost section={section} theme={theme} />;
    case "story":
      return <Story section={section} theme={theme} />;
    case "youtube":
      return <YoutubeThumb section={section} theme={theme} />;
    case "banner":
      return <Banner section={section} theme={theme} />;
    case "email":
      return <Email section={section} theme={theme} />;
    case "pitch":
      return <Pitch section={section} theme={theme} />;
    case "appbar":
      return <AppBar section={section} theme={theme} />;
    case "actions":
      return <Actions section={section} theme={theme} />;
    case "list":
      return <List section={section} theme={theme} />;
    case "tabbar":
      return <TabBar section={section} theme={theme} />;
    case "dashnav":
      return <DashNav section={section} theme={theme} />;
    case "kpis":
      return <Kpis section={section} theme={theme} />;
    case "chart":
      return <Chart section={section} theme={theme} />;
    case "table":
      return <Table section={section} theme={theme} />;
    case "brandmark":
      return <BrandMark section={section} theme={theme} />;
    case "palette":
      return <Palette section={section} theme={theme} />;
    case "type":
      return <TypeSpec section={section} theme={theme} doc={doc} />;
    default:
      return null;
  }
}

function Hero({ section, theme, isMobile }: { section: Section; theme: Theme; isMobile?: boolean }) {
  const visual = String(section.visual || theme.heroVisual || "editorial");
  const layout = String(section.layout || (isMobile ? "centered" : "split"));

  if (layout === "centered") {
    return (
      <div className="flex flex-col items-center text-center px-6 sm:px-12 py-12 sm:py-16">
        {section.kicker ? (
          <div
            className="text-[10px] tracking-[0.24em] uppercase mb-4 font-medium"
            style={{ color: theme.accent }}
          >
            {String(section.kicker)}
          </div>
        ) : null}
        <h1
          className={`${
            isMobile ? "text-[32px]" : "text-[48px]"
          } leading-[1.0] tracking-[-0.03em] mb-4 max-w-[22ch]`}
          style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 450 }}
        >
          {String(section.headline || "")}
        </h1>
        <p
          className="text-[14px] leading-relaxed max-w-[42ch] mb-8"
          style={{ color: theme.muted }}
        >
          {String(section.sub || "")}
        </p>
        <div className="flex flex-wrap gap-3 items-center justify-center mb-10">
          <span
            className="px-5 py-2.5 text-[12px] font-medium transition shadow-sm"
            style={{
              background: theme.accent,
              color: theme.accentFg,
              borderRadius: theme.radius,
            }}
          >
            {String(section.cta || "Start")}
          </span>
          {section.secondary ? (
            <span className="text-[12px] opacity-80" style={{ color: theme.muted }}>
              {String(section.secondary)}
            </span>
          ) : null}
        </div>
        <div className="w-full max-w-[580px]">
          <Visual kind={visual} theme={theme} isMobile={isMobile} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`grid ${
        isMobile ? "grid-cols-1 gap-8 px-6 py-8" : "md:grid-cols-[1.15fr_0.85fr] gap-8 px-8 py-12"
      } items-center`}
    >
      <div>
        {section.kicker ? (
          <div
            className="text-[10px] tracking-[0.22em] uppercase mb-4 font-medium"
            style={{ color: theme.accent }}
          >
            {String(section.kicker)}
          </div>
        ) : null}
        <h1
          className={`${
            isMobile ? "text-[32px]" : "text-[42px]"
          } leading-[1.02] tracking-[-0.03em] mb-5`}
          style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 450 }}
        >
          {String(section.headline || "")}
        </h1>
        <p
          className="text-[14px] leading-relaxed max-w-[36ch] mb-7"
          style={{ color: theme.muted }}
        >
          {String(section.sub || "")}
        </p>
        <div className="flex flex-wrap gap-3 items-center">
          <span
            className="px-4 py-2 text-[12px] font-medium"
            style={{
              background: theme.accent,
              color: theme.accentFg,
              borderRadius: theme.radius,
            }}
          >
            {String(section.cta || "Start")}
          </span>
          {section.secondary ? (
            <span className="text-[12px]" style={{ color: theme.muted }}>
              {String(section.secondary)}
            </span>
          ) : null}
        </div>
      </div>
      <Visual kind={visual} theme={theme} isMobile={isMobile} />
    </div>
  );
}

function Visual({ kind, theme, isMobile }: { kind: string; theme: Theme; isMobile?: boolean }) {
  // 1. Audio Waveform Player
  if (kind === "waveform" || kind === "audio-card") {
    const bars = [18, 35, 55, 24, 70, 95, 45, 80, 60, 30, 85, 100, 50, 75, 40, 90, 65, 35, 20];
    return (
      <div
        className="p-5"
        style={{
          background: theme.surface,
          border: `1px solid ${theme.line}`,
          borderRadius: theme.radius || "16px",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold"
              style={{ background: theme.accent, color: theme.accentFg }}
            >
              ▶
            </span>
            <div>
              <div className="text-[12px] font-medium leading-tight">Meeting Note #04</div>
              <div className="text-[10px] opacity-70" style={{ color: theme.muted }}>
                01:42 / 04:15 · Captured 10m ago
              </div>
            </div>
          </div>
          <span
            className="rounded-full px-2 py-0.5 text-[9px] uppercase tracking-wider font-semibold"
            style={{ background: theme.line, color: theme.fg }}
          >
            AI Summary
          </span>
        </div>

        {/* Waveform graphic */}
        <div className="flex h-16 items-center gap-1 px-1">
          {bars.map((height, i) => (
            <div
              key={i}
              className="flex-1 rounded-full transition-all"
              style={{
                height: `${height}%`,
                background: i < 8 ? theme.accent : theme.line,
                opacity: i < 8 ? 1 : 0.6,
              }}
            />
          ))}
        </div>

        <div className="mt-4 pt-3 flex items-center justify-between border-t border-line text-[11px]">
          <span style={{ color: theme.muted }}>“Synthesized 3 action items and blockers.”</span>
          <span className="font-medium text-[10px]" style={{ color: theme.accent }}>
            View Transcript →
          </span>
        </div>
      </div>
    );
  }

  // 2. Device / App Card Mockup
  if (kind === "device-mockup" || kind === "product") {
    return (
      <div
        className="p-4"
        style={{
          background: theme.surface,
          border: `1px solid ${theme.line}`,
          borderRadius: theme.radius,
        }}
      >
        <div className="flex items-center justify-between border-b pb-2 mb-3" style={{ borderColor: theme.line }}>
          <div className="flex gap-1.5">
            <i className="block w-2 h-2 rounded-full" style={{ background: theme.line }} />
            <i className="block w-2 h-2 rounded-full" style={{ background: theme.line }} />
            <i className="block w-2 h-2 rounded-full" style={{ background: theme.line }} />
          </div>
          <span className="text-[9px] tracking-wider uppercase opacity-60">Preview</span>
        </div>
        <div className="h-3 w-1/3 mb-2 rounded" style={{ background: theme.fg, opacity: 0.85 }} />
        <div className="h-2 w-2/3 mb-4 rounded" style={{ background: theme.line }} />
        <div className="grid grid-cols-2 gap-2.5">
          <div
            className="p-3 rounded"
            style={{ background: theme.bg, border: `1px solid ${theme.line}` }}
          >
            <div className="text-[10px] opacity-70 mb-1">Status</div>
            <div className="text-[12px] font-semibold" style={{ color: theme.accent }}>Active Sync</div>
          </div>
          <div
            className="p-3 rounded"
            style={{ background: theme.bg, border: `1px solid ${theme.line}` }}
          >
            <div className="text-[10px] opacity-70 mb-1">Throughput</div>
            <div className="text-[12px] font-semibold">99.8%</div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Bento Grid Visual
  if (kind === "bento" || kind === "grid") {
    return (
      <div className="grid grid-cols-2 gap-3 min-h-[200px]">
        <div
          className="p-4 flex flex-col justify-end"
          style={{
            background: theme.surface,
            border: `1px solid ${theme.line}`,
            borderRadius: theme.radius,
          }}
        >
          <div className="text-[20px] font-medium leading-none mb-1">4.9/5</div>
          <div className="text-[10px]" style={{ color: theme.muted }}>User Rating</div>
        </div>
        <div
          className="p-4 flex flex-col justify-between"
          style={{
            background: theme.accent,
            color: theme.accentFg,
            borderRadius: theme.radius,
          }}
        >
          <span className="text-[10px] uppercase tracking-wider font-semibold">Live Mode</span>
          <span className="text-[13px] font-medium">Real-time inference</span>
        </div>
      </div>
    );
  }

  if (kind === "gradient") {
    return (
      <div
        className="min-h-[200px]"
        style={{
          borderRadius: theme.radius,
          background: `radial-gradient(120% 90% at 20% 10%, ${theme.accent} 0%, transparent 45%), radial-gradient(90% 80% at 90% 80%, ${theme.fg} 0%, ${theme.bg} 55%)`,
        }}
      />
    );
  }

  return (
    <div className="relative min-h-[200px]">
      <div
        className="absolute inset-4"
        style={{ background: theme.fg, opacity: 0.92, borderRadius: theme.radius }}
      />
      <div
        className="absolute right-0 top-0 w-[55%] h-[70%]"
        style={{ background: theme.accent, borderRadius: theme.radius }}
      />
      <div
        className="absolute left-0 bottom-0 w-[48%] h-[42%]"
        style={{
          background: theme.surface,
          border: `1px solid ${theme.line}`,
          borderRadius: theme.radius,
        }}
      />
    </div>
  );
}

function Stats({ section, theme, isMobile }: { section: Section; theme: Theme; isMobile?: boolean }) {
  const items = (section.items as { value: string; label: string }[]) || [];
  return (
    <div
      className={`grid ${isMobile ? "grid-cols-2 gap-4 px-6 py-6" : "grid-cols-4 px-8 py-8"}`}
      style={{ borderTop: `1px solid ${theme.line}` }}
    >
      {items.map((item) => (
        <div key={item.label}>
          <div className="text-[20px] sm:text-[22px] tracking-tight">{item.value}</div>
          <div className="text-[10px] uppercase tracking-[0.16em] mt-1" style={{ color: theme.muted }}>
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}

function Features({ section, theme, isMobile }: { section: Section; theme: Theme; isMobile?: boolean }) {
  const items = (section.items as { title: string; body: string; tag?: string }[]) || [];
  const layout = String(section.layout || (isMobile ? "cards" : "minimal-cols"));

  return (
    <div className={`${isMobile ? "px-6 py-8" : "px-8 py-10"}`} style={{ borderTop: `1px solid ${theme.line}` }}>
      <h2
        className={`${isMobile ? "text-[24px]" : "text-[28px]"} leading-tight mb-6 max-w-[20ch]`}
        style={{ fontFamily: "var(--font-fraunces), serif" }}
      >
        {String(section.title || "")}
      </h2>
      <div className={`grid ${isMobile ? "grid-cols-1 gap-4" : "md:grid-cols-3 gap-6"}`}>
        {items.map((item) => (
          <div
            key={item.title}
            className={layout === "cards" ? "p-4 rounded-xl border border-line" : "pr-4"}
            style={layout === "cards" ? { background: theme.surface, borderRadius: theme.radius } : undefined}
          >
            <div className="w-8 h-[2px] mb-3" style={{ background: theme.accent }} />
            <div className="text-[14px] sm:text-[15px] font-medium mb-1.5">{item.title}</div>
            <div className="text-[12px] leading-relaxed" style={{ color: theme.muted }}>
              {item.body}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Gallery({ section, theme, isMobile }: { section: Section; theme: Theme; isMobile?: boolean }) {
  const items = (section.items as string[]) || ["A", "B", "C", "D"];
  return (
    <div className={`${isMobile ? "px-6 py-8" : "px-8 py-10"}`} style={{ borderTop: `1px solid ${theme.line}` }}>
      <h2 className="text-[22px] mb-6" style={{ fontFamily: "var(--font-fraunces), serif" }}>
        {String(section.title || "Selected")}
      </h2>
      <div className={`grid ${isMobile ? "grid-cols-2 gap-2.5" : "grid-cols-4 gap-3"}`}>
        {items.map((item, i) => (
          <div key={item} className="aspect-[3/4] p-3 flex items-end" style={{ background: i % 2 ? theme.fg : theme.accent, color: theme.bg }}>
            <span className="text-[11px]">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Testimonials({ section, theme, isMobile }: { section: Section; theme: Theme; isMobile?: boolean }) {
  const items = (section.items as { quote: string; name: string; role: string }[]) || [];
  return (
    <div className={`${isMobile ? "px-6 py-8" : "px-8 py-10"}`} style={{ borderTop: `1px solid ${theme.line}` }}>
      <h2 className="text-[22px] mb-6" style={{ fontFamily: "var(--font-fraunces), serif" }}>
        {String(section.title || "")}
      </h2>
      <div className={`grid ${isMobile ? "grid-cols-1 gap-3.5" : "md:grid-cols-3 gap-4"}`}>
        {items.map((item) => (
          <div
            key={item.name}
            className="p-5"
            style={{ background: theme.surface, border: `1px solid ${theme.line}`, borderRadius: theme.radius }}
          >
            <p className="text-[14px] leading-snug mb-4">“{item.quote}”</p>
            <div className="text-[11px]">{item.name}</div>
            <div className="text-[10px]" style={{ color: theme.muted }}>
              {item.role}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Pricing({ section, theme, isMobile }: { section: Section; theme: Theme; isMobile?: boolean }) {
  const plans = (section.plans as { name: string; price: string; period?: string; features: string[] }[]) || [];
  return (
    <div className={`${isMobile ? "px-6 py-8" : "px-8 py-10"}`} style={{ borderTop: `1px solid ${theme.line}` }}>
      <h2 className="text-[22px] mb-6" style={{ fontFamily: "var(--font-fraunces), serif" }}>
        {String(section.title || "")}
      </h2>
      <div className={`grid ${isMobile ? "grid-cols-1 gap-3.5" : "md:grid-cols-3 gap-4"}`}>
        {plans.map((plan, i) => (
          <div
            key={plan.name}
            className="p-5"
            style={{
              background: i === 1 ? theme.fg : theme.surface,
              color: i === 1 ? theme.bg : theme.fg,
              border: `1px solid ${theme.line}`,
              borderRadius: theme.radius,
            }}
          >
            <div className="text-[12px] uppercase tracking-[0.16em] mb-3">{plan.name}</div>
            <div className="text-[28px]">
              {plan.price}
              <span className="text-[12px] opacity-70">{plan.period || ""}</span>
            </div>
            <ul className="mt-4 space-y-1 text-[12px] opacity-80">
              {(plan.features || []).map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function Cta({ section, theme }: { section: Section; theme: Theme }) {
  return (
    <div className="px-8 py-12 text-center" style={{ background: theme.fg, color: theme.bg }}>
      <h2 className="text-[32px] leading-tight mb-3" style={{ fontFamily: "var(--font-fraunces), serif" }}>
        {String(section.headline || "")}
      </h2>
      <p className="text-[13px] opacity-70 mb-6">{String(section.sub || "")}</p>
      <span
        className="inline-block px-5 py-2 text-[12px]"
        style={{ background: theme.accent, color: theme.accentFg, borderRadius: theme.radius }}
      >
        {String(section.cta || "Start")}
      </span>
    </div>
  );
}

function Footer({ section, theme }: { section: Section; theme: Theme }) {
  const links = (section.links as string[]) || [];
  return (
    <div className="px-8 py-6 flex items-center justify-between text-[11px]" style={{ borderTop: `1px solid ${theme.line}` }}>
      <span>{String(section.brand || "")}</span>
      <span style={{ color: theme.muted }}>{String(section.note || "")}</span>
      <div className="hidden sm:flex gap-4" style={{ color: theme.muted }}>
        {links.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </div>
    </div>
  );
}

function Poster({ section, theme }: { section: Section; theme: Theme }) {
  return (
    <div className="relative min-h-[520px] p-8 flex flex-col justify-between overflow-hidden">
      <div
        className="absolute -right-10 -top-10 w-56 h-56 rounded-full"
        style={{ background: theme.accent, opacity: 0.9 }}
      />
      <div
        className="absolute left-[-20%] bottom-[-10%] w-[70%] h-[40%]"
        style={{ background: theme.fg, opacity: 0.08 }}
      />
      <div className="text-[11px] tracking-[0.22em] uppercase" style={{ color: theme.accent }}>
        {String(section.kicker || "Studio print")}
      </div>
      <div>
        <h1
          className="text-[64px] leading-[0.85] tracking-[-0.04em] mb-4"
          style={{ fontFamily: "var(--font-fraunces), serif" }}
        >
          {String(section.title || "")}
        </h1>
        <p className="text-[16px] max-w-[22ch]" style={{ color: theme.muted }}>
          {String(section.subtitle || "")}
        </p>
      </div>
      <div className="flex justify-between text-[12px] uppercase tracking-[0.14em]">
        <span>{String(section.meta || "")}</span>
        <span>{String(section.place || "")}</span>
      </div>
    </div>
  );
}

function FacebookAd({ section, theme }: { section: Section; theme: Theme }) {
  return (
    <div className="bg-white text-[#050505]" style={{ fontFamily: "var(--font-figtree), sans-serif" }}>
      <div className="flex items-center gap-3 px-4 pt-4">
        <div className="h-10 w-10 rounded-full" style={{ background: theme.accent }} />
        <div className="min-w-0">
          <div className="text-[14px] font-semibold leading-tight">{String(section.page || "")}</div>
          <div className="text-[11px] text-[#65676b]">{String(section.sponsored || "Sponsored")} · {String(section.url || "")}</div>
        </div>
        <span className="ml-auto text-[#65676b]">···</span>
      </div>
      <p className="px-4 py-3 text-[14px] leading-snug">{String(section.primary || "")}</p>
      <div className="relative min-h-[220px]" style={{ background: `linear-gradient(135deg, ${theme.fg} 0%, ${theme.accent} 100%)` }}>
        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
          <div className="text-[11px] uppercase tracking-[0.18em] opacity-80">{String(section.page || "")}</div>
          <div className="mt-2 font-display text-[32px] leading-[0.95]">{String(section.headline || "")}</div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 bg-[#f0f2f5] px-4 py-3">
        <div className="min-w-0">
          <div className="truncate text-[11px] uppercase tracking-[0.08em] text-[#65676b]">{String(section.url || "")}</div>
          <div className="truncate text-[14px] font-semibold">{String(section.headline || "")}</div>
          <div className="truncate text-[12px] text-[#65676b]">{String(section.description || "")}</div>
        </div>
        <span className="shrink-0 rounded-md bg-[#e4e6eb] px-3 py-2 text-[12px] font-semibold">{String(section.cta || "Shop now")}</span>
      </div>
    </div>
  );
}

function InstagramPost({ section, theme }: { section: Section; theme: Theme }) {
  return (
    <div className="bg-white text-[#050505]">
      <div className="flex items-center gap-3 px-3 py-3">
        <div className="h-8 w-8 rounded-full" style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.fg})` }} />
        <div className="text-[13px] font-semibold">{String(section.handle || "")}</div>
        <span className="ml-auto text-[12px] font-semibold" style={{ color: theme.accent }}>{String(section.cta || "Follow")}</span>
      </div>
      <div className="relative aspect-square" style={{ background: theme.fg, color: theme.bg }}>
        <div className="absolute inset-0 p-8 flex flex-col justify-between">
          <div className="text-[11px] tracking-[0.22em] uppercase opacity-70">New</div>
          <h1 className="font-display text-[48px] leading-[0.9]">{String(section.title || "")}</h1>
        </div>
      </div>
      <div className="px-3 py-3 text-[13px]">
        <div className="mb-2 text-[13px] font-semibold">{String(section.likes || "2,418")} likes</div>
        <p><span className="font-semibold">{String(section.handle || "")}</span> {String(section.caption || "")}</p>
      </div>
    </div>
  );
}

function Story({ section, theme }: { section: Section; theme: Theme }) {
  return (
    <div className="relative min-h-[640px] p-6 flex flex-col justify-between" style={{ background: theme.fg, color: theme.bg }}>
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full" style={{ background: theme.accent }} />
        <span className="text-[12px] font-semibold">{String(section.handle || "")}</span>
      </div>
      <div>
        <h1 className="font-display text-[56px] leading-[0.9]">{String(section.title || "")}</h1>
        <p className="mt-4 max-w-[18ch] text-[16px] opacity-80">{String(section.subtitle || "")}</p>
      </div>
      <div className="mx-auto rounded-full px-6 py-2 text-[13px] font-semibold" style={{ background: theme.accent, color: theme.accentFg }}>
        {String(section.cta || "Swipe up")}
      </div>
    </div>
  );
}

function YoutubeThumb({ section, theme }: { section: Section; theme: Theme }) {
  return (
    <div className="relative aspect-video overflow-hidden p-6 flex flex-col justify-between" style={{ background: theme.fg, color: theme.bg }}>
      <div className="text-[12px] font-bold tracking-[0.14em] uppercase" style={{ color: theme.accent }}>{String(section.kicker || "")}</div>
      <h1 className="font-display text-[52px] leading-[0.85] max-w-[12ch]">{String(section.title || "")}</h1>
      <div className="flex items-end justify-between">
        <span className="rounded bg-black/70 px-2 py-0.5 text-[11px] text-white">{String(section.duration || "12:04")}</span>
        <span className="text-[18px] font-black tracking-widest" style={{ color: theme.accent }}>{String(section.subtitle || "WATCH")}</span>
      </div>
    </div>
  );
}

function Banner({ section, theme }: { section: Section; theme: Theme }) {
  return (
    <div className="flex min-h-[160px] items-center justify-between gap-6 px-8" style={{ background: theme.fg, color: theme.bg }}>
      <div>
        <div className="text-[11px] uppercase tracking-[0.18em] opacity-70">{String(section.brand || "")}</div>
        <div className="font-display text-[32px] leading-none mt-1">{String(section.headline || "")}</div>
        <p className="mt-2 max-w-[40ch] text-[13px] opacity-70">{String(section.sub || "")}</p>
      </div>
      <span className="shrink-0 rounded-full px-5 py-2 text-[13px] font-semibold" style={{ background: theme.accent, color: theme.accentFg }}>
        {String(section.cta || "Shop")}
      </span>
    </div>
  );
}

function Email({ section, theme }: { section: Section; theme: Theme }) {
  return (
    <div className="mx-auto max-w-[520px]">
      <div className="px-8 py-6 text-[12px] uppercase tracking-[0.16em]" style={{ borderBottom: `1px solid ${theme.line}` }}>
        {String(section.brand || "")}
      </div>
      <div className="px-8 py-10">
        <div className="text-[12px] mb-3" style={{ color: theme.muted }}>{String(section.preheader || "")}</div>
        <h1 className="font-display text-[36px] leading-[1.05] mb-4">{String(section.headline || "")}</h1>
        <p className="text-[14px] leading-relaxed mb-6" style={{ color: theme.muted }}>{String(section.body || "")}</p>
        <span className="inline-block px-5 py-2 text-[13px]" style={{ background: theme.accent, color: theme.accentFg, borderRadius: theme.radius }}>
          {String(section.cta || "Open")}
        </span>
      </div>
    </div>
  );
}

function Pitch({ section, theme }: { section: Section; theme: Theme }) {
  const points = (section.points as string[]) || [];
  return (
    <div className="min-h-[420px] p-10 flex flex-col justify-between">
      <div className="text-[12px] uppercase tracking-[0.18em]" style={{ color: theme.accent }}>{String(section.kicker || "")}</div>
      <div>
        <h1 className="font-display text-[48px] leading-[0.95] max-w-[16ch]">{String(section.title || "")}</h1>
        <p className="mt-4 max-w-[40ch] text-[16px]" style={{ color: theme.muted }}>{String(section.subtitle || "")}</p>
      </div>
      <ol className="grid gap-2 text-[14px]">
        {points.map((p, i) => (
          <li key={p} className="flex gap-3">
            <span style={{ color: theme.accent }}>{String(i + 1).padStart(2, "0")}</span>
            {p}
          </li>
        ))}
      </ol>
    </div>
  );
}

function Social({ section, theme }: { section: Section; theme: Theme }) {
  return (
    <div className="aspect-square p-8 flex flex-col justify-between">
      <div className="text-[11px] tracking-[0.24em]">{String(section.kicker || "")}</div>
      <h1
        className="text-[48px] leading-[0.9]"
        style={{ fontFamily: "var(--font-fraunces), serif" }}
      >
        {String(section.title || "")}
      </h1>
      <div>
        <p className="text-[14px] mb-4" style={{ color: theme.muted }}>
          {String(section.subtitle || "")}
        </p>
        <span
          className="text-[11px] px-3 py-1"
          style={{ border: `1px solid ${theme.fg}`, borderRadius: "999px" }}
        >
          {String(section.cta || "Open")}
        </span>
      </div>
    </div>
  );
}

function AppBar({ section, theme }: { section: Section; theme: Theme }) {
  return (
    <div className="px-6 pt-6 pb-3 flex items-end justify-between">
      <div>
        <div className="text-[11px]" style={{ color: theme.muted }}>
          {String(section.subtitle || "")}
        </div>
        <div className="text-[22px]">{String(section.title || "")}</div>
      </div>
      <div className="w-8 h-8 rounded-full" style={{ background: theme.accent }} />
    </div>
  );
}

function Actions({ section, theme }: { section: Section; theme: Theme }) {
  const items = (section.items as { label: string }[]) || [];
  return (
    <div className="px-6 py-4 grid grid-cols-4 gap-3">
      {items.map((item) => (
        <div key={item.label} className="text-center">
          <div
            className="w-12 h-12 mx-auto mb-2 rounded-full"
            style={{ background: theme.surface, border: `1px solid ${theme.line}` }}
          />
          <div className="text-[10px]" style={{ color: theme.muted }}>
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}

function List({ section, theme }: { section: Section; theme: Theme }) {
  const items = (section.items as { title: string; meta: string }[]) || [];
  return (
    <div className="px-6 py-4">
      <div className="text-[12px] uppercase tracking-[0.16em] mb-3" style={{ color: theme.muted }}>
        {String(section.title || "")}
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.title}
            className="flex items-center justify-between px-4 py-3"
            style={{ background: theme.surface, borderRadius: theme.radius }}
          >
            <span className="text-[13px]">{item.title}</span>
            <span className="text-[11px]" style={{ color: theme.muted }}>
              {item.meta}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TabBar({ section, theme }: { section: Section; theme: Theme }) {
  const items = (section.items as string[]) || [];
  return (
    <div
      className="mt-4 px-4 py-3 grid grid-cols-4 text-[10px] uppercase tracking-[0.12em]"
      style={{ borderTop: `1px solid ${theme.line}` }}
    >
      {items.map((item, i) => (
        <div key={item} className="text-center" style={{ color: i === 0 ? theme.fg : theme.muted }}>
          {item}
        </div>
      ))}
    </div>
  );
}

function DashNav({ section, theme }: { section: Section; theme: Theme }) {
  const links = (section.links as string[]) || [];
  return (
    <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${theme.line}` }}>
      <div className="text-[15px]">{String(section.brand || "")}</div>
      <div className="flex gap-5 text-[12px]" style={{ color: theme.muted }}>
        {links.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </div>
    </div>
  );
}

function Kpis({ section, theme }: { section: Section; theme: Theme }) {
  const items = (section.items as { label: string; value: string; delta: string }[]) || [];
  return (
    <div className="grid grid-cols-4 gap-3 px-6 py-5">
      {items.map((item) => (
        <div
          key={item.label}
          className="p-4"
          style={{ background: theme.surface, border: `1px solid ${theme.line}`, borderRadius: theme.radius }}
        >
          <div className="text-[10px] uppercase tracking-[0.14em]" style={{ color: theme.muted }}>
            {item.label}
          </div>
          <div className="text-[22px] mt-1">{item.value}</div>
          <div className="text-[11px]" style={{ color: theme.accent }}>
            {item.delta}
          </div>
        </div>
      ))}
    </div>
  );
}

function Chart({ section, theme }: { section: Section; theme: Theme }) {
  const series = Array.isArray(section.series) && section.series.length > 0
    ? (section.series as number[])
    : [28, 45, 38, 65, 52, 78, 70, 92, 85, 98];
  const max = Math.max(...series, 100);

  return (
    <div className="px-6 py-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-[15px] font-medium">{String(section.title || "Metrics Overview")}</div>
          <div className="text-[11px]" style={{ color: theme.muted }}>
            {String(section.caption || "Dynamic metric trajectory")}
          </div>
        </div>
        <span
          className="text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold"
          style={{ background: theme.surface, color: theme.accent, border: `1px solid ${theme.line}` }}
        >
          Live
        </span>
      </div>
      <div
        className="p-4 rounded-xl flex items-end gap-2.5 h-36"
        style={{ background: theme.surface, border: `1px solid ${theme.line}`, borderRadius: theme.radius }}
      >
        {series.map((val, i) => {
          const heightPct = Math.max(12, Math.min(100, (val / max) * 100));
          const isLatest = i === series.length - 1;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
              <div
                className="w-full transition-all duration-300 rounded-t"
                style={{
                  height: `${heightPct}%`,
                  background: isLatest ? theme.accent : theme.fg,
                  opacity: isLatest ? 1 : 0.22,
                }}
              />
              <span className="text-[9px] opacity-60 truncate">{val}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Table({ section, theme }: { section: Section; theme: Theme }) {
  const headers = Array.isArray(section.headers) ? (section.headers as string[]) : ["Item", "Status", "Value"];
  const rows = (section.rows as string[][]) || [];

  return (
    <div className="px-6 py-5">
      <div className="text-[15px] font-medium mb-3">{String(section.title || "Recent Activity")}</div>
      <div
        className="overflow-hidden"
        style={{ border: `1px solid ${theme.line}`, borderRadius: theme.radius, background: theme.surface }}
      >
        {headers.length > 0 && (
          <div
            className="grid px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider opacity-70"
            style={{
              gridTemplateColumns: `repeat(${headers.length}, minmax(0, 1fr))`,
              background: theme.bg,
              borderBottom: `1px solid ${theme.line}`,
            }}
          >
            {headers.map((h) => (
              <span key={h}>{h}</span>
            ))}
          </div>
        )}
        {rows.map((row, i) => (
          <div
            key={i}
            className="grid px-4 py-3 text-[12px] items-center"
            style={{
              gridTemplateColumns: `repeat(${headers.length || row.length}, minmax(0, 1fr))`,
              borderTop: i ? `1px solid ${theme.line}` : undefined,
            }}
          >
            {row.map((cell, cIdx) => (
              <span
                key={cIdx}
                className={cIdx === row.length - 1 ? "font-medium" : undefined}
                style={
                  cell.toLowerCase() === "completed" || cell.toLowerCase() === "active" || cell.toLowerCase() === "paid"
                    ? { color: theme.accent, fontWeight: 600 }
                    : undefined
                }
              >
                {cell}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function BrandMark({ section, theme }: { section: Section; theme: Theme }) {
  return (
    <div className="px-8 py-12 flex items-center gap-8">
      <div
        className="w-24 h-24 flex items-center justify-center text-[40px]"
        style={{
          background: theme.fg,
          color: theme.bg,
          borderRadius: theme.radius,
          fontFamily: "var(--font-fraunces), serif",
        }}
      >
        {String(section.mark || "V")}
      </div>
      <div>
        <div className="text-[36px] leading-none" style={{ fontFamily: "var(--font-fraunces), serif" }}>
          {String(section.name || "")}
        </div>
        <div className="text-[14px] mt-2" style={{ color: theme.muted }}>
          {String(section.tagline || "")}
        </div>
      </div>
    </div>
  );
}

function Palette({ section, theme }: { section: Section; theme: Theme }) {
  const swatches = (section.swatches as string[]) || [];
  return (
    <div className="px-8 py-8" style={{ borderTop: `1px solid ${theme.line}` }}>
      <div className="text-[18px] mb-4">{String(section.title || "Palette")}</div>
      <div className="flex">
        {swatches.map((c) => (
          <div key={c} className="flex-1 h-28" style={{ background: c }} />
        ))}
      </div>
    </div>
  );
}

function TypeSpec({ section, theme, doc }: { section: Section; theme: Theme; doc: DesignDoc }) {
  return (
    <div className="px-8 py-8" style={{ borderTop: `1px solid ${theme.line}` }}>
      <div className="text-[18px] mb-4">{String(section.title || "Type")}</div>
      <div className="text-[48px] leading-none" style={{ fontFamily: "var(--font-fraunces), serif" }}>
        {doc.name}
      </div>
      <div className="text-[16px] mt-3 max-w-[40ch]" style={{ color: theme.muted }}>
        {String(section.sample || "")}
      </div>
    </div>
  );
}
