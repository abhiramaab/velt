"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutGrid, LogOut, Menu, Plus, Sparkles, X } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { clearSession, getStoredUser, type User } from "@/lib/api";
import { useEffect, useState } from "react";

export function Sidebar() {
  const path = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [path]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Mobile top bar */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-line bg-paper/95 px-4 backdrop-blur-md lg:hidden">
        <Link href="/" className="text-ink">
          <Logo className="text-[19px]" />
        </Link>
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          className="flex size-9 items-center justify-center rounded-full border border-line text-ink-soft transition hover:bg-paper-2"
        >
          <Menu size={18} />
        </button>
      </header>

      {/* Mobile drawer backdrop */}
      {open ? (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm lg:hidden"
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-full w-[268px] max-w-[82vw] shrink-0 flex-col border-r border-line bg-paper transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:static lg:z-auto lg:w-[232px] lg:max-w-none lg:translate-x-0 ${
          open ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between px-5 py-5">
          <div>
            <Link href="/" className="text-ink">
              <Logo />
            </Link>
            <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-muted">
              {user?.name || "Studio"} workspace
            </p>
          </div>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="flex size-8 items-center justify-center rounded-full text-muted transition hover:bg-paper-2 hover:text-ink lg:hidden"
          >
            <X size={16} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3 text-sm">
          <Link
            href="/studio"
            className="flex items-center gap-2 rounded-xl bg-ink px-3 py-2.5 text-paper"
          >
            <Plus size={15} /> New composition
          </Link>
          <Link
            href="/studio"
            className={`mt-2 flex items-center gap-2 rounded-xl px-3 py-2 ${
              path === "/studio" ? "bg-paper" : "text-ink-soft hover:text-ink"
            }`}
          >
            <LayoutGrid size={15} /> Projects
          </Link>
          <Link
            href="/showcase"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-ink-soft hover:text-ink"
          >
            <Sparkles size={15} /> Showcase
          </Link>
        </nav>

        <div className="border-t border-line px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="truncate text-[12px] text-muted">{user?.email}</div>
          <div className="mt-1 flex items-center justify-between text-sm">
            <span>
              {user?.credits ?? "—"} <span className="text-muted">{user?.credits === 1 ? "design" : "credits"}</span>
            </span>
            <span className="rounded-full bg-paper-2 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em]">
              {user?.plan || "free"}
            </span>
          </div>
          {user && user.plan !== "Max Lifetime VIP" && !user.email.includes("abhiram") && (
            <Link
              href="/pricing"
              className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-xl bg-ink px-3 py-1.5 text-center text-xs font-medium text-paper transition hover:opacity-90"
            >
              <Sparkles size={12} />
              Upgrade Plan
            </Link>
          )}
          <button
            onClick={() => {
              clearSession();
              router.push("/");
            }}
            className="mt-3 flex items-center gap-2 text-[12px] text-muted hover:text-ink"
          >
            <LogOut size={12} /> Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
