"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutGrid, LogOut, Plus, Sparkles } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { clearSession, getStoredUser, type User } from "@/lib/api";
import { useEffect, useState } from "react";

export function Sidebar() {
  const path = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  return (
    <aside className="flex h-full w-[232px] shrink-0 flex-col border-r border-line bg-paper-2/40">
      <div className="px-5 py-5">
        <Link href="/" className="text-ink">
          <Logo />
        </Link>
        <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-muted">
          {user?.name || "Studio"} workspace
        </p>
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
      <div className="border-t border-line px-4 py-4">
        <div className="text-[12px] text-muted">{user?.email}</div>
        <div className="mt-1 flex items-center justify-between text-sm">
          <span>
            {user?.credits ?? "—"} <span className="text-muted">credits</span>
          </span>
          <span className="rounded-full bg-paper px-2 py-0.5 text-[10px] uppercase tracking-[0.14em]">
            {user?.plan || "free"}
          </span>
        </div>
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
  );
}
