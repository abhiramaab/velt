import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { extractAuthUser } from "@/lib/server/jwt";

const PLAN_PRICING: Record<string, { name: string; monthlyUsd: number; monthlyInr: number; credits: number }> = {
  starter: {
    name: "Starter",
    monthlyUsd: 6,
    monthlyInr: 500, // ~ $6 USD in INR paise = 50000 paise (₹500)
    credits: 85,
  },
  pro: {
    name: "Pro",
    monthlyUsd: 19,
    monthlyInr: 1600, // ~ $19 USD in INR paise = 160000 paise (₹1600)
    credits: 250,
  },
  max: {
    name: "Max",
    monthlyUsd: 26,
    monthlyInr: 2200, // ~ $26 USD in INR paise = 220000 paise (₹2200)
    credits: 450,
  },
};

export async function POST(req: Request) {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: "Razorpay credentials are not configured on server." },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { planKey, billingCycle = "monthly" } = body;

    const plan = PLAN_PRICING[planKey?.toLowerCase()];
    if (!plan) {
      return NextResponse.json({ error: "Invalid plan specified." }, { status: 400 });
    }

    // Convert USD to INR paise (Razorpay standard currency in India, supports intl cards too)
    // USD rate ~ 85 INR per USD or fixed plan INR
    const isYearly = billingCycle === "annually";
    const baseAmountInr = isYearly ? Math.round(plan.monthlyInr * 12 * 0.7) : plan.monthlyInr;
    const amountInPaise = Math.round(baseAmountInr * 100);

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const user = extractAuthUser(req);
    const receipt = `rcpt_${planKey}_${Date.now()}`.slice(0, 40);

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt,
      notes: {
        plan: plan.name,
        planKey: planKey.toLowerCase(),
        billingCycle,
        userId: user?.sub || "guest",
        userEmail: user?.email || "guest@velt.design",
      },
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
      plan: plan.name,
      planKey: planKey.toLowerCase(),
      credits: plan.credits,
    });
  } catch (error: any) {
    console.error("Razorpay order creation failed:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create Razorpay order" },
      { status: 500 }
    );
  }
}
