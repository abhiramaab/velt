import crypto from "crypto";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "velt-studio-dev-secret-key-please-change-in-production-256bit";

function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return Buffer.from(base64, "base64").toString("utf-8");
}

export interface JwtPayload {
  sub: string;
  email: string;
  name?: string;
  plan: string;
  credits: number;
  iat: number;
  exp: number;
}

export function signJwt(payload: Omit<JwtPayload, "iat" | "exp">, expiresInSeconds = 7 * 86400): string {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload: JwtPayload = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));
  const signatureInput = `${encodedHeader}.${encodedPayload}`;

  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(signatureInput)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return `${signatureInput}.${signature}`;
}

export function verifyJwt(token: string): JwtPayload | null {
  if (!token || typeof token !== "string") return null;
  const parts = token.trim().split(".");
  if (parts.length !== 3) return null;

  const [encodedHeader, encodedPayload, signature] = parts;
  const signatureInput = `${encodedHeader}.${encodedPayload}`;

  const expectedSignature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(signatureInput)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  if (signature !== expectedSignature) {
    return null;
  }

  try {
    const payload: JwtPayload = JSON.parse(base64UrlDecode(encodedPayload));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export function extractAuthUser(req: Request): JwtPayload | null {
  const authHeader = req.headers.get("Authorization") || "";
  if (!authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.replace("Bearer ", "").trim();
  return verifyJwt(token);
}
