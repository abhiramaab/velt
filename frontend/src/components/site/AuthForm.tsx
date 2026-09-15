"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";
import { saveSession, velt } from "@/lib/api";
import { useTheme } from "@/lib/theme";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const params = useSearchParams();
  const { theme } = useTheme();
  const night = theme === "dark";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const nextQuery = () => {
    const prompt = params.get("prompt");
    const format = params.get("format");
    const q = new URLSearchParams();
    if (prompt) q.set("prompt", prompt);
    if (format) q.set("format", format);
    const s = q.toString();
    return s ? `/studio?${s}` : "/studio";
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res =
        mode === "signup"
          ? await velt.register(name, email, password)
          : await velt.login(email, password);
      saveSession(res.token, res.user);
      router.push(nextQuery());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function demo() {
    setBusy(true);
    setError("");
    try {
      const res = await velt.login("studio@velt.app", "veltstudio");
      saveSession(res.token, res.user);
      router.push(nextQuery());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Demo login failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="relative grid min-h-screen md:grid-cols-2">
      <div className="hero-sky relative hidden overflow-hidden md:block">
        <img src="/hero-day.jpg?v=3" alt="" className={`hero-photo ${night ? "opacity-0" : "opacity-100"}`} />
        <img src="/hero-night.jpg?v=3" alt="" className={`hero-photo ${night ? "opacity-100" : "opacity-0"}`} />
        <div className="relative z-10 flex h-full flex-col justify-between p-10 text-white">
          <Link href="/" className="font-lastik text-[22px] text-white">
            <Logo />
          </Link>
          <div>
            <h2 className="font-lastik text-5xl leading-[1.05]">
              Describe what you want,
              <br />
              and we handle the rest.
            </h2>
            <p className="mt-4 max-w-sm text-sm text-white/85">From idea to stunning design in seconds.</p>
          </div>
          <p className="text-xs text-white/70">Guest plan includes 40 credits. No card.</p>
        </div>
      </div>
      <div className="flex items-center justify-center bg-white px-6 py-16">
        <div className="w-full max-w-sm">
          <Link href="/" className="mb-10 inline-block font-lastik text-[22px] text-slate-900 md:hidden">
            <Logo />
          </Link>
          <h1 className="font-lastik text-4xl text-slate-900">
            {mode === "signup" ? "Get started" : "Welcome back"}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {mode === "signup" ? (
              <>
                Already have an account?{" "}
                <Link href="/login" className="text-sky-600 underline">
                  Login
                </Link>
              </>
            ) : (
              <>
                New here?{" "}
                <Link href="/signup" className="text-sky-600 underline">
                  Get started
                </Link>
              </>
            )}
          </p>
          <form onSubmit={submit} className="mt-8 space-y-3">
            {mode === "signup" ? (
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
              />
            ) : null}
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
            />
            <input
              required
              type="password"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
            />
            {error ? <p className="text-sm text-red-500">{error}</p> : null}
            <button
              disabled={busy}
              className="w-full rounded-full bg-sky-500 py-3 text-sm font-semibold text-white hover:bg-sky-600 disabled:opacity-60"
            >
              {busy ? "Opening…" : mode === "signup" ? "Create account" : "Login"}
            </button>
          </form>
          <button
            onClick={demo}
            disabled={busy}
            className="mt-3 w-full rounded-full border border-slate-200 py-3 text-sm text-slate-600"
          >
            Continue as demo studio
          </button>
        </div>
      </div>
    </main>
  );
}
