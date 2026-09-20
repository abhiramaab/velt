import { NextResponse } from "next/server";
import { DEMO_USER } from "@/lib/server/storage";
import { signJwt } from "@/lib/server/jwt";
import { getUserUsage } from "@/lib/server/ratelimit";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = body.email;
    const password = body.password;

    if (!email || !email.trim()) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }
    if (!password || !password.trim()) {
      return NextResponse.json({ error: "Password is required." }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Master Admin account: abhiram.b@icloud.com with Abhi60@123
    let plan = "Free Trial";
    let credits = 1;
    let name = cleanEmail.split("@")[0] || "Creator";

    if (cleanEmail === "abhiram.b@icloud.com" || cleanEmail === "abhiram.b@icloud.om") {
      if (password !== "Abhi60@123") {
        return NextResponse.json({ error: "Invalid password for administrator account." }, { status: 401 });
      }
      plan = "Max Lifetime VIP";
      credits = 999999;
      name = "Abhiram (Admin)";
    } else {
      const usage = getUserUsage(cleanEmail, "Free Trial");
      credits = usage.remaining;
    }

    const user = {
      ...DEMO_USER,
      id: `usr_${Buffer.from(cleanEmail).toString("hex").slice(0, 16)}`,
      email: cleanEmail,
      name,
      plan,
      credits,
    };

    const token = signJwt({
      sub: user.id,
      email: user.email,
      name: user.name,
      plan: user.plan,
      credits: user.credits,
    });

    return NextResponse.json({
      token,
      user,
    });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Login failed." }, { status: 500 });
  }
}
