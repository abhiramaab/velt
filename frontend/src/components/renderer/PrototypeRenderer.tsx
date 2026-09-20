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
    case "trading_terminal":
      return <TradingTerminal section={section} theme={theme} />;
    case "order_book":
      return <OrderBook section={section} theme={theme} />;
    case "products_grid":
      return <ProductsGrid section={section} theme={theme} />;
    case "bento_analytics":
      return <BentoAnalytics section={section} theme={theme} />;
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
  const heroImage = section.image as string | undefined;

  // Editorial Cover / Full-bleed Magazine spread (AURELI / LUMEN / Bühler style)
  if (layout === "editorial-cover" || layout === "magazine") {
    return (
      <div className="relative overflow-hidden">
        <div className={`relative ${isMobile ? "min-h-[360px] p-6" : "min-h-[460px] p-10 sm:p-14"} flex flex-col justify-between`}>
          {heroImage && (
            <div className="absolute inset-0 z-0">
              <img src={heroImage} alt="" className="h-full w-full object-cover brightness-[0.92]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            </div>
          )}
          <div className="relative z-10 flex items-start justify-between">
            {section.kicker ? (
              <span className="inline-block rounded-full bg-white/90 backdrop-blur px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-black">
                {String(section.kicker)}
              </span>
            ) : <span />}
            {Boolean(section.meta) && (
              <span className="text-[11px] uppercase tracking-widest text-white/80 font-mono">
                {String(section.meta)}
              </span>
            )}
          </div>

          <div className="relative z-10 mt-auto max-w-2xl pt-16">
            <h1
              className={`${
                isMobile ? "text-[34px]" : "text-[54px] sm:text-[64px]"
              } leading-[0.96] tracking-[-0.035em] text-white font-medium`}
              style={{ fontFamily: theme.fontDisplay === "serif" ? "var(--font-fraunces), serif" : "var(--font-figtree), sans-serif" }}
            >
              {String(section.headline || "")}
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-white/85 max-w-lg">
              {String(section.sub || "")}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <span
                className="px-5 py-2.5 text-[12px] font-semibold uppercase tracking-wider transition shadow-lg cursor-pointer"
                style={{
                  background: theme.accent,
                  color: theme.accentFg,
                  borderRadius: theme.radius || "4px",
                }}
              >
                {String(section.cta || "Discover")}
              </span>
              {Boolean(section.secondary) && (
                <span className="text-[12px] text-white/90 underline underline-offset-4 font-medium cursor-pointer">
                  {String(section.secondary)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            className="px-5 py-2.5 text-[12px] font-medium transition shadow-sm cursor-pointer"
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
        <div className="w-full max-w-[620px]">
          <Visual kind={visual} theme={theme} isMobile={isMobile} image={heroImage} />
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
            className="px-4 py-2 text-[12px] font-medium transition shadow-sm cursor-pointer"
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
      <Visual kind={visual} theme={theme} isMobile={isMobile} image={heroImage} />
    </div>
  );
}

function Visual({
  kind,
  theme,
  isMobile,
  image,
}: {
  kind: string;
  theme: Theme;
  isMobile?: boolean;
  image?: string;
}) {
  // If an image URL is supplied, render high-editorial frame
  if (image) {
    return (
      <div
        className="overflow-hidden shadow-sm"
        style={{
          borderRadius: theme.radius || "8px",
          border: `1px solid ${theme.line}`,
        }}
      >
        <img
          src={image}
          alt=""
          className="w-full object-cover max-h-[360px] transition-transform duration-500 hover:scale-[1.02]"
        />
      </div>
    );
  }

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

  // 2. Architecture / Swiss Grid Frame — generated geometry, no photo assets
  if (kind === "architecture" || kind === "swiss") {
    const panels = [
      { label: "Form", ratio: "col-span-2 row-span-2" },
      { label: "Light", ratio: "" },
      { label: "Mass", ratio: "" },
      { label: "Site", ratio: "col-span-2" },
    ];
    return (
      <div
        className="relative overflow-hidden p-5"
        style={{
          background: theme.surface,
          border: `1px solid ${theme.line}`,
          borderRadius: theme.radius || "4px",
        }}
      >
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] mb-4" style={{ color: theme.muted }}>
          <span>Plate 01 // Section</span>
          <span className="font-bold" style={{ color: theme.accent }}>01 / 04</span>
        </div>
        <div className="grid grid-cols-4 grid-rows-2 gap-2 h-44">
          {panels.map((p, i) => (
            <div
              key={p.label}
              className={`relative overflow-hidden rounded ${p.ratio}`}
              style={{
                background: i === 0 ? theme.accent : i === 3 ? theme.fg : theme.bg,
                border: `1px solid ${theme.line}`,
                color: i === 0 ? theme.accentFg : i === 3 ? theme.bg : theme.fg,
              }}
            >
              <span className="absolute bottom-2 left-2 text-[9px] font-mono uppercase tracking-[0.18em] opacity-80">
                {p.label}
              </span>
              {i === 0 && (
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute left-1/2 top-0 h-full w-px bg-current" />
                  <div className="absolute top-1/2 left-0 h-px w-full bg-current" />
                  <div className="absolute right-4 top-4 h-10 w-10 rounded-full border-2 border-current" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Browser / product UI mockup — a real interface wireframe in the theme
  if (kind === "ui-mockup" || kind === "browser") {
    const rows = [72, 88, 60, 94, 78];
    return (
      <div
        className="overflow-hidden shadow-sm"
        style={{
          background: theme.surface,
          border: `1px solid ${theme.line}`,
          borderRadius: theme.radius || "12px",
        }}
      >
        <div className="flex items-center gap-2 px-3.5 py-2.5" style={{ borderBottom: `1px solid ${theme.line}` }}>
          <span className="size-2 rounded-full" style={{ background: theme.line }} />
          <span className="size-2 rounded-full" style={{ background: theme.line }} />
          <span className="size-2 rounded-full" style={{ background: theme.line }} />
          <span className="ml-2 flex-1 truncate rounded px-2 py-0.5 text-[9px]" style={{ background: theme.bg, color: theme.muted }}>
            app.preview
          </span>
        </div>
        <div className="grid grid-cols-[88px_1fr] min-h-[210px]">
          <div className="p-3 space-y-2" style={{ borderRight: `1px solid ${theme.line}`, background: theme.bg }}>
            <div className="h-2 w-full rounded-full" style={{ background: theme.accent, opacity: 0.9 }} />
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-1.5 rounded-full" style={{ background: theme.line, width: `${80 - i * 12}%` }} />
            ))}
          </div>
          <div className="p-3.5">
            <div className="flex items-center justify-between">
              <div className="h-2.5 w-24 rounded-full" style={{ background: theme.fg, opacity: 0.85 }} />
              <div className="h-5 w-14 rounded-full" style={{ background: theme.accent }} />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="rounded p-2" style={{ background: theme.bg, border: `1px solid ${theme.line}` }}>
                  <div className="h-1.5 w-8 rounded-full" style={{ background: theme.muted, opacity: 0.5 }} />
                  <div className="mt-1.5 h-2.5 w-12 rounded-full" style={{ background: theme.fg, opacity: 0.8 }} />
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-end gap-1.5 h-16 rounded p-2" style={{ background: theme.bg }}>
              {rows.map((h, i) => (
                <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, background: i === rows.length - 1 ? theme.accent : theme.fg, opacity: i === rows.length - 1 ? 1 : 0.25 }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Device / App Card Mockup
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

  // 4. Bento Grid Visual
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

  // Default: an abstract but composed product frame in the theme palette
  return (
    <div
      className="relative min-h-[220px] overflow-hidden p-5 flex flex-col justify-between"
      style={{
        background: theme.surface,
        border: `1px solid ${theme.line}`,
        borderRadius: theme.radius || "16px",
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="size-7 rounded-lg" style={{ background: theme.accent }} />
          <span className="h-2 w-20 rounded-full" style={{ background: theme.fg, opacity: 0.8 }} />
        </div>
        <span className="h-5 w-14 rounded-full" style={{ background: theme.bg, border: `1px solid ${theme.line}` }} />
      </div>
      <div className="my-4 space-y-2.5">
        <div className="h-3 w-3/4 rounded-full" style={{ background: theme.fg, opacity: 0.85 }} />
        <div className="h-2 w-1/2 rounded-full" style={{ background: theme.line }} />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="rounded-lg p-2.5"
            style={{ background: theme.bg, border: `1px solid ${theme.line}` }}
          >
            <span className="block size-4 rounded" style={{ background: i === 1 ? theme.accent : theme.fg, opacity: i === 1 ? 1 : 0.25 }} />
            <span className="mt-2 block h-1.5 w-10 rounded-full" style={{ background: theme.line }} />
          </div>
        ))}
      </div>
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
  const rawItems = (section.items as unknown[]) || [];
  const subtitle = section.subtitle ? String(section.subtitle) : undefined;
  const layout = String(section.layout || (isMobile ? "grid-2" : "grid-3"));

  return (
    <div className={`${isMobile ? "px-6 py-8" : "px-8 py-12"}`} style={{ borderTop: `1px solid ${theme.line}` }}>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
        <div>
          {Boolean(section.kicker) && (
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] mb-2 block" style={{ color: theme.accent }}>
              {String(section.kicker)}
            </span>
          )}
          <h2 className="text-[24px] sm:text-[30px] font-medium leading-tight" style={{ fontFamily: "var(--font-fraunces), serif" }}>
            {String(section.title || "Selected Works")}
          </h2>
          {Boolean(subtitle) && (
            <p className="text-[13px] mt-1.5 opacity-70 max-w-md" style={{ color: theme.muted }}>
              {subtitle}
            </p>
          )}
        </div>
        <span className="mt-3 sm:mt-0 text-[11px] font-mono uppercase tracking-wider opacity-80 cursor-pointer" style={{ color: theme.accent }}>
          View Archive →
        </span>
      </div>

      <div className={`grid ${isMobile ? "grid-cols-1 sm:grid-cols-2 gap-4" : layout === "grid-2" ? "grid-cols-2 gap-6" : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"}`}>
        {rawItems.map((item, i) => {
          if (typeof item === "string") {
            return (
              <div
                key={i}
                className="aspect-[4/3] rounded-lg p-5 flex flex-col justify-between overflow-hidden shadow-sm transition-transform duration-300 hover:-translate-y-1"
                style={{ background: i % 2 ? theme.fg : theme.accent, color: theme.bg }}
              >
                <span className="text-[10px] font-mono tracking-widest uppercase opacity-70">Project 0{i + 1}</span>
                <span className="text-[16px] font-medium">{item}</span>
              </div>
            );
          }

          const obj = item as { title?: string; tag?: string; image?: string; meta?: string; caption?: string };
          return (
            <div
              key={i}
              className="group overflow-hidden rounded-xl border transition-all duration-300 hover:shadow-lg"
              style={{
                background: theme.surface,
                borderColor: theme.line,
                borderRadius: theme.radius || "12px",
              }}
            >
              {obj.image ? (
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img
                    src={obj.image}
                    alt={obj.title || ""}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {obj.tag && (
                    <span className="absolute top-3 left-3 rounded-full bg-black/75 backdrop-blur px-2.5 py-0.5 text-[9px] uppercase tracking-wider text-white font-mono">
                      {obj.tag}
                    </span>
                  )}
                </div>
              ) : (
                <div
                  className="aspect-[16/10] p-4 flex flex-col justify-between"
                  style={{ background: i % 2 === 0 ? theme.accent : theme.fg, color: theme.accentFg || theme.bg }}
                >
                  <span className="text-[9px] font-mono uppercase tracking-widest opacity-80">{obj.tag || `Case 0${i + 1}`}</span>
                  <div className="font-display text-lg font-medium leading-snug">{obj.title || obj.caption}</div>
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>{obj.tag || "Editorial"}</span>
                  <span>{obj.meta || "2026"}</span>
                </div>
                <h3 className="font-display mt-1.5 text-[17px] font-medium leading-snug" style={{ color: theme.fg }}>
                  {obj.title || obj.caption || "Monograph"}
                </h3>
              </div>
            </div>
          );
        })}
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
  const layout = String(section.layout || "swiss");
  const title = String(section.title || "Untitled Print");
  const subtitle = String(section.subtitle || "");
  const kicker = String(section.kicker || "Studio Edition");
  const meta = String(section.meta || "Edition of 100");
  const place = String(section.place || "Zurich · Berlin");
  const lineup = Array.isArray(section.lineup) ? (section.lineup as string[]) : [];

  // Brutalist / Techno / Event Poster
  if (layout === "brutalist" || layout === "techno" || layout === "rave") {
    return (
      <div
        className="relative min-h-[580px] p-8 flex flex-col justify-between overflow-hidden font-mono"
        style={{ background: theme.bg, color: theme.fg, border: `2px solid ${theme.fg}` }}
      >
        <div className="flex items-center justify-between border-b-2 pb-3 uppercase text-[11px] font-bold" style={{ borderColor: theme.fg }}>
          <span>{kicker}</span>
          <span className="px-2 py-0.5" style={{ background: theme.accent, color: theme.accentFg }}>{meta}</span>
        </div>

        <div className="my-8">
          <div className="text-[12px] uppercase opacity-70 tracking-widest mb-1">{place}</div>
          <h1 className="text-[64px] sm:text-[80px] font-black uppercase tracking-tighter leading-[0.82] break-words">
            {title}
          </h1>
          {subtitle && <p className="mt-4 text-[14px] uppercase max-w-[28ch] opacity-80 leading-snug">{subtitle}</p>}
        </div>

        {lineup.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 py-4 border-t border-b text-[12px] font-bold uppercase" style={{ borderColor: theme.fg }}>
            {lineup.map((artist, idx) => (
              <span key={idx}>+ {artist}</span>
            ))}
          </div>
        )}

        <div className="flex items-end justify-between pt-4 text-[10px] tracking-widest uppercase">
          <div className="space-y-0.5">
            <div>DOORS: 22:00</div>
            <div>ENTRY: TICKETED</div>
          </div>
          <div className="font-bold text-[14px]" style={{ color: theme.accent }}>
            NO PHOTOGRAPHY
          </div>
        </div>
      </div>
    );
  }

  // Geometric Swiss Grid
  if (layout === "grid" || layout === "swiss") {
    return (
      <div
        className="relative min-h-[560px] p-8 flex flex-col justify-between overflow-hidden"
        style={{ background: theme.bg, color: theme.fg }}
      >
        <div className="grid grid-cols-3 gap-4 pb-4 border-b text-[11px] uppercase tracking-widest font-mono" style={{ borderColor: theme.line }}>
          <span>{kicker}</span>
          <span className="text-center">{place}</span>
          <span className="text-right" style={{ color: theme.accent }}>{meta}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-auto py-10 items-center">
          <div className="md:col-span-8">
            <h1
              className="text-[64px] sm:text-[76px] leading-[0.88] tracking-[-0.04em] font-medium"
              style={{ fontFamily: theme.fontDisplay === "serif" ? "var(--font-fraunces), serif" : "var(--font-figtree), sans-serif" }}
            >
              {title}
            </h1>
            {subtitle && (
              <p className="mt-5 text-[15px] max-w-[32ch] leading-relaxed" style={{ color: theme.muted }}>
                {subtitle}
              </p>
            )}
          </div>
          <div className="md:col-span-4 flex flex-col items-center justify-center">
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center text-[12px] font-mono uppercase text-center p-4"
              style={{ background: theme.accent, color: theme.accentFg }}
            >
              {place}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center text-[11px] uppercase tracking-[0.2em] pt-4 border-t font-mono" style={{ borderColor: theme.line }}>
          <span>ARCHIVE MONOGRAPH</span>
          <span>{new Date().getFullYear()} COLLECTION</span>
        </div>
      </div>
    );
  }

  // Default Minimalist Poster
  return (
    <div className="relative min-h-[520px] p-8 flex flex-col justify-between overflow-hidden" style={{ background: theme.bg, color: theme.fg }}>
      <div
        className="absolute -right-10 -top-10 w-56 h-56 rounded-full"
        style={{ background: theme.accent, opacity: 0.9 }}
      />
      <div
        className="absolute left-[-20%] bottom-[-10%] w-[70%] h-[40%]"
        style={{ background: theme.fg, opacity: 0.08 }}
      />
      <div className="text-[11px] tracking-[0.22em] uppercase relative z-10" style={{ color: theme.accent }}>
        {kicker}
      </div>
      <div className="relative z-10">
        <h1
          className="text-[64px] leading-[0.85] tracking-[-0.04em] mb-4"
          style={{ fontFamily: "var(--font-fraunces), serif" }}
        >
          {title}
        </h1>
        <p className="text-[16px] max-w-[22ch]" style={{ color: theme.muted }}>
          {subtitle}
        </p>
      </div>
      <div className="flex justify-between text-[12px] uppercase tracking-[0.14em] relative z-10 font-mono">
        <span>{meta}</span>
        <span>{place}</span>
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
      {items.map((item, i) => (
        <div key={item.label} className="text-center">
          <div
            className="w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center"
            style={{
              background: i === 0 ? theme.accent : theme.surface,
              color: i === 0 ? theme.accentFg : theme.accent,
              border: `1px solid ${i === 0 ? theme.accent : theme.line}`,
            }}
          >
            <span className="block size-4 rounded-[4px] border-2 border-current opacity-80" />
          </div>
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
        {items.map((item, i) => (
          <div
            key={item.title}
            className="flex items-center gap-3 px-4 py-3"
            style={{ background: theme.surface, borderRadius: theme.radius }}
          >
            <span
              className="size-9 shrink-0 rounded-lg"
              style={{
                background: i % 2 === 0 ? theme.accent : theme.fg,
                opacity: i % 2 === 0 ? 0.9 : 0.14,
              }}
            />
            <span className="min-w-0 flex-1 truncate text-[13px]">{item.title}</span>
            <span className="shrink-0 text-[11px]" style={{ color: theme.muted }}>
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

function TradingTerminal({ section, theme }: { section: Section; theme: Theme }) {
  const pair = String(section.pair || "BTC/USDT");
  const price = String(section.price || "$67,420.50");
  const change = String(section.change || "+4.85%");
  const high = String(section.high || "$68,120.00");
  const low = String(section.low || "$64,890.00");
  const volume = String(section.volume || "1.42B USDT");
  const candles = Array.isArray(section.candles) && section.candles.length > 0
    ? (section.candles as Array<{ open: number; close: number; high: number; low: number }>)
    : [
        { open: 64, close: 66, high: 67, low: 63 },
        { open: 66, close: 65, high: 68, low: 64 },
        { open: 65, close: 68, high: 69, low: 64 },
        { open: 68, close: 67, high: 70, low: 66 },
        { open: 67, close: 71, high: 72, low: 66 },
        { open: 71, close: 69, high: 73, low: 68 },
        { open: 69, close: 74, high: 75, low: 68 },
        { open: 74, close: 72, high: 76, low: 71 },
        { open: 72, close: 77, high: 78, low: 71 },
        { open: 77, close: 79, high: 80, low: 75 },
        { open: 79, close: 78, high: 81, low: 76 },
        { open: 78, close: 83, high: 84, low: 77 },
        { open: 83, close: 82, high: 85, low: 80 },
        { open: 82, close: 86, high: 87, low: 81 },
      ];

  const minVal = Math.min(...candles.map((c) => c.low));
  const maxVal = Math.max(...candles.map((c) => c.high));
  const range = maxVal - minVal || 1;

  return (
    <div className="px-6 py-4">
      {/* Ticker Bar */}
      <div
        className="flex flex-wrap items-center justify-between gap-4 p-4 mb-3"
        style={{ background: theme.surface, border: `1px solid ${theme.line}`, borderRadius: theme.radius }}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[17px] font-bold tracking-tight">{pair}</span>
          </div>
          <span className="text-[20px] font-mono font-semibold" style={{ color: theme.fg }}>
            {price}
          </span>
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-500/15 text-emerald-400">
            {change}
          </span>
        </div>
        <div className="flex items-center gap-6 text-[11px] font-mono" style={{ color: theme.muted }}>
          <div>
            <span className="opacity-60 uppercase block text-[9px]">24h High</span>
            <span className="font-semibold text-emerald-400">{high}</span>
          </div>
          <div>
            <span className="opacity-60 uppercase block text-[9px]">24h Low</span>
            <span className="font-semibold text-rose-400">{low}</span>
          </div>
          <div>
            <span className="opacity-60 uppercase block text-[9px]">24h Volume</span>
            <span className="font-semibold">{volume}</span>
          </div>
          <div className="flex items-center gap-1.5 pl-2 border-l border-white/10">
            <button className="px-2 py-1 rounded text-[10px] uppercase font-bold bg-emerald-500 text-black hover:opacity-90">
              Buy
            </button>
            <button className="px-2 py-1 rounded text-[10px] uppercase font-bold bg-rose-500 text-white hover:opacity-90">
              Sell
            </button>
          </div>
        </div>
      </div>

      {/* Candlestick Interactive Chart Area */}
      <div
        className="p-5 relative"
        style={{ background: theme.surface, border: `1px solid ${theme.line}`, borderRadius: theme.radius }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {["1m", "5m", "15m", "1H", "4H", "1D"].map((interval, i) => (
              <span
                key={interval}
                className={`px-2 py-0.5 text-[10px] font-mono rounded cursor-pointer ${
                  i === 3 ? "bg-white/15 font-bold" : "opacity-60 hover:opacity-100"
                }`}
              >
                {interval}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-3 text-[10px] font-mono opacity-60">
            <span>MA(7): 67,112</span>
            <span>MA(25): 66,450</span>
            <span className="text-emerald-400">RSI(14): 62.4</span>
          </div>
        </div>

        {/* Real Candlestick Bars */}
        <div className="h-56 flex items-end justify-between gap-1 sm:gap-2 pt-4 pb-2 border-b border-t border-white/5 relative">
          {/* Subtle horizontal grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
            <div className="w-full border-b border-white" />
            <div className="w-full border-b border-white" />
            <div className="w-full border-b border-white" />
          </div>

          {candles.map((c, i) => {
            const isGreen = c.close >= c.open;
            const candleTop = Math.max(c.open, c.close);
            const candleBottom = Math.min(c.open, c.close);

            const bodyHeightPct = Math.max(8, ((candleTop - candleBottom) / range) * 100);
            const bottomOffsetPct = ((candleBottom - minVal) / range) * 80;
            const wickHeightPct = Math.max(15, ((c.high - c.low) / range) * 100);
            const wickBottomOffsetPct = ((c.low - minVal) / range) * 80;

            const color = isGreen ? "#10b981" : "#f43f5e";

            return (
              <div key={i} className="flex-1 flex flex-col items-center h-full relative justify-end group cursor-crosshair">
                {/* Upper/Lower Wick */}
                <div
                  className="w-[1.5px] absolute"
                  style={{
                    height: `${wickHeightPct}%`,
                    bottom: `${wickBottomOffsetPct}%`,
                    background: color,
                    opacity: 0.7,
                  }}
                />
                {/* Real Candle Body */}
                <div
                  className="w-full max-w-[18px] rounded-[1px] absolute shadow-sm"
                  style={{
                    height: `${bodyHeightPct}%`,
                    bottom: `${bottomOffsetPct}%`,
                    background: color,
                    boxShadow: isGreen ? "0 0 8px rgba(16,185,129,0.3)" : "0 0 8px rgba(244,63,94,0.3)",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function OrderBook({ section, theme }: { section: Section; theme: Theme }) {
  const asks = (section.asks as Array<{ price: string; amount: string; total: string }>) || [
    { price: "67,480.00", amount: "1.420", total: "95.8k" },
    { price: "67,460.50", amount: "0.850", total: "57.3k" },
    { price: "67,440.00", amount: "2.105", total: "141.9k" },
    { price: "67,425.00", amount: "0.340", total: "22.9k" },
  ];
  const bids = (section.bids as Array<{ price: string; amount: string; total: string }>) || [
    { price: "67,410.00", amount: "1.120", total: "75.4k" },
    { price: "67,395.00", amount: "3.450", total: "232.5k" },
    { price: "67,380.00", amount: "0.980", total: "66.0k" },
    { price: "67,365.00", amount: "1.890", total: "127.3k" },
  ];

  return (
    <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Live Orderbook Panel */}
      <div
        className="p-4"
        style={{ background: theme.surface, border: `1px solid ${theme.line}`, borderRadius: theme.radius }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="text-[13px] font-bold uppercase tracking-wider">Live Order Book</div>
          <span className="text-[10px] font-mono opacity-60">Spread 0.50 USDT</span>
        </div>
        <div className="grid grid-cols-3 text-[10px] uppercase font-mono tracking-wider opacity-50 pb-1.5 border-b border-white/10">
          <span>Price (USDT)</span>
          <span className="text-right">Size</span>
          <span className="text-right">Sum</span>
        </div>
        {/* Asks (Sells) */}
        <div className="py-1 space-y-1 font-mono text-[11px]">
          {asks.map((a, i) => (
            <div key={i} className="grid grid-cols-3 relative items-center py-0.5">
              <div className="absolute inset-y-0 right-0 bg-rose-500/10 pointer-events-none" style={{ width: `${(i + 1) * 22}%` }} />
              <span className="text-rose-400 font-semibold relative z-10">{a.price}</span>
              <span className="text-right relative z-10">{a.amount}</span>
              <span className="text-right opacity-60 relative z-10">{a.total}</span>
            </div>
          ))}
        </div>
        {/* Current Mid-Price Bar */}
        <div className="my-2 py-1.5 px-3 rounded bg-white/5 flex items-center justify-between font-mono">
          <span className="text-[14px] font-bold text-emerald-400">67,420.50 ↑</span>
          <span className="text-[10px] opacity-60">Market Index</span>
        </div>
        {/* Bids (Buys) */}
        <div className="py-1 space-y-1 font-mono text-[11px]">
          {bids.map((b, i) => (
            <div key={i} className="grid grid-cols-3 relative items-center py-0.5">
              <div className="absolute inset-y-0 right-0 bg-emerald-500/10 pointer-events-none" style={{ width: `${(4 - i) * 22}%` }} />
              <span className="text-emerald-400 font-semibold relative z-10">{b.price}</span>
              <span className="text-right relative z-10">{b.amount}</span>
              <span className="text-right opacity-60 relative z-10">{b.total}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Market Telemetry & Trade History */}
      <div
        className="p-4 flex flex-col justify-between"
        style={{ background: theme.surface, border: `1px solid ${theme.line}`, borderRadius: theme.radius }}
      >
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="text-[13px] font-bold uppercase tracking-wider">Recent Executions</div>
            <span className="text-[10px] font-mono text-emerald-400">● LIVE FEED</span>
          </div>
          <div className="space-y-2 font-mono text-[11px]">
            {[
              { time: "10:14:02", side: "BUY", price: "67,420.50", size: "0.245 BTC" },
              { time: "10:13:58", side: "SELL", price: "67,419.00", size: "1.120 BTC" },
              { time: "10:13:45", side: "BUY", price: "67,422.00", size: "0.089 BTC" },
              { time: "10:13:30", side: "BUY", price: "67,420.00", size: "2.500 BTC" },
              { time: "10:13:12", side: "SELL", price: "67,415.50", size: "0.450 BTC" },
            ].map((t, i) => (
              <div key={i} className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="opacity-50">{t.time}</span>
                <span className={`font-semibold ${t.side === "BUY" ? "text-emerald-400" : "text-rose-400"}`}>{t.side}</span>
                <span>{t.price}</span>
                <span className="opacity-70">{t.size}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono">
          <span className="opacity-60">Engine Latency: 1.2ms</span>
          <span className="opacity-60">Liquidity Depth: Tier-1</span>
        </div>
      </div>
    </div>
  );
}

function ProductsGrid({ section, theme }: { section: Section; theme: Theme }) {
  const title = String(section.title || "Top Performing Products");
  const products = (section.items as Array<{ name: string; category: string; sales: string; revenue: string; stock: string; trend: string }>) || [
    { name: "Minimal Leather Desk Pad", category: "Accessories", sales: "1,420", revenue: "$85,200", stock: "In Stock (84)", trend: "+24%" },
    { name: "Nordic Ceramic Pour-Over", category: "Kitchenware", sales: "980", revenue: "$44,100", stock: "Low (12)", trend: "+18%" },
    { name: "Wool Felt Laptop Sleeve", category: "Carry", sales: "760", revenue: "$38,000", stock: "In Stock (140)", trend: "+9%" },
    { name: "Matte Brass Desktop Lamp", category: "Lighting", sales: "520", revenue: "$72,800", stock: "Pre-order", trend: "+31%" },
  ];

  return (
    <div className="px-6 py-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[15px] font-medium">{title}</div>
        <span className="text-[11px] font-semibold px-2.5 py-1 rounded" style={{ background: theme.surface, color: theme.accent, border: `1px solid ${theme.line}` }}>
          Store Performance
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {products.map((p, i) => (
          <div
            key={i}
            className="p-4 flex flex-col justify-between"
            style={{ background: theme.surface, border: `1px solid ${theme.line}`, borderRadius: theme.radius }}
          >
            <div>
              <div className="flex items-center justify-between text-[10px] uppercase tracking-wider mb-1" style={{ color: theme.muted }}>
                <span>{p.category}</span>
                <span className="text-emerald-500 font-bold">{p.trend}</span>
              </div>
              <div className="font-medium text-[14px] leading-snug line-clamp-2">{p.name}</div>
            </div>
            <div className="mt-4 pt-3 border-t border-line/60 flex items-center justify-between">
              <div>
                <span className="text-[9px] uppercase tracking-wider opacity-60 block">Revenue</span>
                <span className="font-semibold text-[15px]">{p.revenue}</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] uppercase tracking-wider opacity-60 block">Units Sold</span>
                <span className="text-[12px] opacity-80">{p.sales}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BentoAnalytics({ section, theme }: { section: Section; theme: Theme }) {
  const cards = (section.cards as Array<{ title: string; metric: string; detail: string; tag?: string }>) || [
    { title: "Monthly Recurring Revenue", metric: "$124,500", detail: "+18.4% vs last month", tag: "MRR" },
    { title: "Active Customer Churn", metric: "1.4%", detail: "Industry benchmark 2.8%", tag: "Retention" },
    { title: "Average Revenue Per Unit", metric: "$89.50", detail: "Expanded through add-ons", tag: "ARPU" },
    { title: "Net Expansion Rate", metric: "114%", detail: "Enterprise cohort retention", tag: "Expansion" },
  ];

  return (
    <div className="px-6 py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((c, i) => (
          <div
            key={i}
            className="p-5 flex flex-col justify-between group hover:border-accent transition-colors"
            style={{ background: theme.surface, border: `1px solid ${theme.line}`, borderRadius: theme.radius }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium opacity-70">{c.title}</span>
              {c.tag && (
                <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded font-semibold" style={{ background: theme.bg, color: theme.accent }}>
                  {c.tag}
                </span>
              )}
            </div>
            <div className="mt-3">
              <div className="text-[26px] font-bold tracking-tight">{c.metric}</div>
              <div className="text-[11px] mt-1 opacity-70">{c.detail}</div>
            </div>
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
