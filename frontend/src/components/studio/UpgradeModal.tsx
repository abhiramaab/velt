"use client";

import Link from "next/link";
import { Check, Sparkles, X, Zap } from "lucide-react";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export function UpgradeModal({
  isOpen,
  onClose,
  title = "Free Trial Limit Reached",
  description = "Your 2-day free trial (up to 200 credits) has ended or reached its limit. Upgrade to Starter, Pro, or Max to continue generating and exporting production-grade layouts.",
}: UpgradeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg rounded-3xl border border-line bg-paper p-6 sm:p-8 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-muted hover:bg-paper-2 hover:text-ink transition"
          title="Close"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Zap size={20} />
          </div>
          <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-300">
            Free Limit Reached
          </span>
        </div>

        <h3 className="mt-4 font-lastik text-2xl text-ink sm:text-3xl leading-snug">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {description}
        </p>

        {/* Benefits breakdown */}
        <div className="mt-6 space-y-3 rounded-2xl border border-line bg-paper-2 p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
            Why Upgrade to Velt Pro:
          </div>
          <ul className="space-y-2 text-[13px] text-ink">
            <li className="flex items-start gap-2.5">
              <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>85 to 450 designs per month</strong> (Starter, Pro, Max)</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Advanced Reasoning Engine</strong> & full site layout clones</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Production Code Export</strong> (Tailwind, HTML, Shopify & React)</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Priority Rendering Queue</strong> with 0 queue wait times</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full text-sm font-medium text-muted hover:text-ink transition"
          >
            Maybe later
          </button>
          <Link
            href="/pricing"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-paper shadow-md hover:opacity-90 transition"
          >
            <Sparkles size={16} />
            Upgrade Plan (From $6/mo)
          </Link>
        </div>
      </div>
    </div>
  );
}
