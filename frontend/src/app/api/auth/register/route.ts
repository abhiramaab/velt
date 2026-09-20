import { NextResponse } from "next/server";
import { DEMO_USER } from "@/lib/server/storage";
import { signJwt } from "@/lib/server/jwt";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = body.email;
    const password = body.password;
    const name = body.name;

    if (!email || !email.trim()) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }
    if (!password || !password.trim()) {
      return NextResponse.json({ error: "Password is required." }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = (name && name.trim()) || cleanEmail.split("@")[0] || "Creator";

    const user = {
      ...DEMO_USER,
      id: `usr_${Buffer.from(cleanEmail).toString("hex").slice(0, 16)}`,
      email: cleanEmail,
      name: cleanName,
      plan: "Free Trial",
      credits: 1,
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
    console.error("Registration error:", err);
    return NextResponse.json({ error: "Registration failed." }, { status: 500 });
  }
}
