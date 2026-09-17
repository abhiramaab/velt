import { NextResponse } from "next/server";
import { DEMO_USER } from "@/lib/server/storage";
import { signJwt } from "@/lib/server/jwt";

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
    const user = {
      ...DEMO_USER,
      id: `usr_${Buffer.from(cleanEmail).toString("hex").slice(0, 16)}`,
      email: cleanEmail,
      name: cleanEmail.split("@")[0] || "Creator",
    };

    const token = signJwt({
      sub: user.id,
      email: user.email,
      name: user.name,
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
