"use client";

import { useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { Check, Loader2, Sparkles } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { getStoredUser, getToken, saveSession } from "@/lib/api";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    monthly: 6,
    note: "Free 2-day trial included (200 credits), then $6/mo.",
    items: [
      "2-Day Free Trial (up to 200 credits)",
      "85 high-res designs / month",
      "Website & Landing Page generator",
      "Full Code (Tailwind + HTML) & PNG Export",
      "Chat-based AI refinements",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    monthly: 19,
    note: "Free 2-day trial included (200 credits), then $19/mo.",
    items: [
      "2-Day Free Trial (up to 200 credits)",
      "250 high-res designs / month",
      "Everything in Starter",
      "Advanced Reasoning & Layout Extraction",
      "Clone from URL (e.g. shipper.now)",
      "Priority rendering queue",
    ],
  },
  {
    id: "max",
    name: "Max",
    monthly: 26,
    note: "Free 2-day trial included (200 credits), then $26/mo.",
    items: [
      "2-Day Free Trial (up to 200 credits)",
      "450 high-res designs / month",
      "Everything in Pro",
      "Long-context memory & unlimited revisions",
      "Priority VIP generation engine",
      "Direct designer support",
    ],
  },
];

export default function PricingPage() {
  const router = useRouter();
  const [yearly, setYearly] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoadingPlan(planId);

    try {
      const token = getToken();
      const currentUser = getStoredUser();

      // If user isn't logged in, redirect them to sign up with plan intent
      if (!token) {
        router.push(`/signup?plan=${planId}`);
        return;
      }

      // Check Razorpay script load
      if (typeof window === "undefined" || !window.Razorpay) {
        throw new Error("Razorpay SDK is loading. Please try again in a few seconds.");
      }

      // Create Razorpay Order
      const res = await fetch("/api/payment/razorpay-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          planKey: planId,
          billingCycle: yearly ? "annually" : "monthly",
        }),
      });

      const orderData = await res.json();
      if (!res.ok) {
        throw new Error(orderData.error || "Failed to initiate payment.");
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Velt Studio",
        description: `Upgrade to ${orderData.plan} Plan`,
        order_id: orderData.orderId,
        prefill: {
          name: currentUser?.name || "",
          email: currentUser?.email || "",
        },
        theme: {
          color: "#0f172a",
        },
        handler: async function (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) {
          try {
            setLoadingPlan(planId);
            const verifyRes = await fetch("/api/payment/razorpay-verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                ...response,
                planKey: planId,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) {
              throw new Error(verifyData.error || "Payment verification failed.");
            }

            if (verifyData.token && verifyData.user) {
              saveSession(verifyData.token, verifyData.user);
            }

            setSuccessMessage(`Payment successful! You are now on the ${orderData.plan} plan.`);
            setTimeout(() => {
              router.push("/studio");
            }, 1200);
          } catch (verErr: any) {
            setErrorMessage(verErr?.message || "Verification error occurred.");
          } finally {
            setLoadingPlan(null);
          }
        },
        modal: {
          ondismiss: function () {
            setLoadingPlan(null);
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.on("payment.failed", function (response: any) {
        setErrorMessage(response.error?.description || "Payment failed.");
        setLoadingPlan(null);
      });

      razorpayInstance.open();
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to start checkout.");
      setLoadingPlan(null);
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <Nav />
      <main className="mx-auto max-w-[980px] px-6 pb-20 pt-32">
        <h1 className="font-lastik text-5xl text-slate-900 md:text-6xl">Plans and Pricing</h1>
        <p className="mt-4 max-w-xl text-slate-500">
          Flexible plans for generating polished UI, graphics, mockups, and design iterations with a clean workflow.
        </p>

        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900">
          <Sparkles className="size-5 shrink-0 text-sky-600" />
          <span>
            <strong>Free 2-Day Trial on All Plans:</strong> Get started immediately with up to <strong>200 credits</strong>. Cancel anytime with no commitments.
          </span>
        </div>

        {errorMessage && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            {successMessage}
          </div>
        )}

        <div className="mt-8 inline-flex rounded-full border border-slate-200 p-1 text-sm font-medium">
          <button
            onClick={() => setYearly(false)}
            className={`rounded-full px-4 py-1.5 transition-colors ${
              !yearly ? "bg-slate-900 text-white" : "text-slate-500"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setYearly(true)}
            className={`rounded-full px-4 py-1.5 transition-colors ${
              yearly ? "bg-slate-900 text-white" : "text-slate-500"
            }`}
          >
            Annually · Save 30%
          </button>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {PLANS.map((plan, i) => {
            const price = yearly ? Math.round(plan.monthly * 0.7) : plan.monthly;
            const isLoading = loadingPlan === plan.id;

            return (
              <div
                key={plan.name}
                className={`flex flex-col justify-between rounded-[22px] border p-7 ${
                  i === 1 ? "border-slate-900 bg-slate-900 text-white shadow-xl" : "border-slate-200 bg-white"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-semibold">{plan.name}</span>
                    {i === 1 && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-medium text-white">
                        <Sparkles size={11} /> Popular
                      </span>
                    )}
                  </div>
                  <div className="font-lastik mt-4 text-5xl">
                    ${price}
                    <span className="text-lg opacity-60">/ mo</span>
                  </div>
                  <p className={`mt-3 text-sm ${i === 1 ? "text-white/70" : "text-slate-500"}`}>{plan.note}</p>
                  <ul className="mt-6 space-y-2 text-sm">
                    {plan.items.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <Check size={14} className="shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={Boolean(loadingPlan)}
                  className={`mt-8 flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-center text-sm font-semibold transition-all disabled:opacity-50 ${
                    i === 1 ? "bg-white text-slate-900 hover:bg-slate-100" : "bg-slate-900 text-white hover:bg-slate-800"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Processing…
                    </>
                  ) : (
                    `Upgrade to ${plan.name}`
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </>
  );
}
