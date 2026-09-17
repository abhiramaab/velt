import { NextResponse } from "next/server";
import { DEMO_USER } from "@/lib/server/storage";
import { extractAuthUser } from "@/lib/server/jwt";

export async function GET(req: Request) {
  const authUser = extractAuthUser(req);
  if (!authUser) {
    return NextResponse.json({ error: "Unauthorized: Valid JWT required." }, { status: 401 });
  }

  return NextResponse.json({
    ...DEMO_USER,
    id: authUser.sub,
    email: authUser.email,
    name: authUser.name || authUser.email.split("@")[0] || DEMO_USER.name,
  });
}
