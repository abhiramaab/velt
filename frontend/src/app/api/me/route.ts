import { NextResponse } from "next/server";
import { DEMO_USER } from "@/lib/server/storage";

export async function GET(req: Request) {
  const auth = req.headers.get("Authorization") || "";
  let email = DEMO_USER.email;
  if (auth.startsWith("Bearer velt_jwt_")) {
    try {
      email = Buffer.from(auth.replace("Bearer velt_jwt_", ""), "base64").toString("utf-8");
    } catch {
      /* ignore */
    }
  }
  return NextResponse.json({
    ...DEMO_USER,
    email,
    name: email.split("@")[0] || DEMO_USER.name,
  });
}
