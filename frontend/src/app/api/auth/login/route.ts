import { NextResponse } from "next/server";
import { DEMO_USER } from "@/lib/server/storage";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = body.email || "creator@velt.design";
    const user = {
      ...DEMO_USER,
      email,
      name: email.split("@")[0] || "Creator",
    };
    return NextResponse.json({
      token: "velt_jwt_" + Buffer.from(email).toString("base64"),
      user,
    });
  } catch (err) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
