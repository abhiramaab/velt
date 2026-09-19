import { NextResponse } from "next/server";
import crypto from "crypto";
import { signJwt, extractAuthUser } from "@/lib/server/jwt";
import { PLANS_CONFIG } from "@/lib/server/ratelimit";

export async function POST(req: Request) {
  try {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json({ error: "Razorpay secret not configured." }, { status: 500 });
    }

    const body = await req.json().catch(() => ({}));
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planKey,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing payment verification parameters." }, { status: 400 });
    }

    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(text)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature." }, { status: 400 });
    }

    // Payment is verified!
    const normalizedPlan = (planKey || "starter").toLowerCase();
    const planConfig = PLANS_CONFIG[normalizedPlan] || PLANS_CONFIG.starter;
    const authUser = extractAuthUser(req);

    const email = authUser?.email || "creator@velt.design";
    const sub = authUser?.sub || `usr_${Buffer.from(email).toString("hex").slice(0, 16)}`;
    const name = authUser?.name || email.split("@")[0] || "Creator";

    // Issue updated token with new plan & monthly limit credits
    const updatedToken = signJwt({
      sub,
      email,
      name,
      plan: planConfig.name,
      credits: planConfig.monthlyLimit,
    });

    const updatedUser = {
      id: sub,
      email,
      name,
      plan: planConfig.name,
      credits: planConfig.monthlyLimit,
    };

    return NextResponse.json({
      success: true,
      message: `Successfully upgraded to ${planConfig.name}!`,
      token: updatedToken,
      user: updatedUser,
      paymentId: razorpay_payment_id,
    });
  } catch (error: any) {
    console.error("Razorpay verification error:", error);
    return NextResponse.json({ error: error?.message || "Payment verification failed" }, { status: 500 });
  }
}
