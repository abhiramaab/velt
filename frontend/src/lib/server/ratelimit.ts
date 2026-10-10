export interface PlanLimits {
  name: string;
  monthlyLimit: number;
  perMinuteLimit: number; // Burst rate limit per minute
  unlimited: boolean;
}

export const PLANS_CONFIG: Record<string, PlanLimits> = {
  free: {
    name: "Free Trial (2-Day)",
    monthlyLimit: 200,
    perMinuteLimit: 5,
    unlimited: false,
  },
  starter: {
    name: "Starter",
    monthlyLimit: 85,
    perMinuteLimit: 15,
    unlimited: false,
  },
  pro: {
    name: "Pro",
    monthlyLimit: 250,
    perMinuteLimit: 40,
    unlimited: false,
  },
  max: {
    name: "Max",
    monthlyLimit: 450,
    perMinuteLimit: 80,
    unlimited: false,
  },
  admin: {
    name: "Max Lifetime VIP",
    monthlyLimit: 999999,
    perMinuteLimit: 999999,
    unlimited: true,
  },
};

// Global stores for serverless / in-memory persistence across hot reloads
declare global {
  // eslint-disable-next-line no-var
  var __velt_usage: Map<string, { count: number; month: string }> | undefined;
  // eslint-disable-next-line no-var
  var __velt_auth_ip_timestamps: Map<string, number[]> | undefined;
  // eslint-disable-next-line no-var
  var __velt_plan_burst_timestamps: Map<string, number[]> | undefined;
}

if (!globalThis.__velt_usage) {
  globalThis.__velt_usage = new Map();
}
if (!globalThis.__velt_auth_ip_timestamps) {
  globalThis.__velt_auth_ip_timestamps = new Map();
}
if (!globalThis.__velt_plan_burst_timestamps) {
  globalThis.__velt_plan_burst_timestamps = new Map();
}

const usageStore = globalThis.__velt_usage!;
const authIpStore = globalThis.__velt_auth_ip_timestamps!;
const planBurstStore = globalThis.__velt_plan_burst_timestamps!;

function currentMonthKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}`;
}

/**
 * Extracts client IP address safely from Request headers (proxy, load-balancer, cloudflare, or socket)
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  const cfIp = req.headers.get("cf-connecting-ip");
  if (cfIp) {
    return cfIp.trim();
  }
  return "127.0.0.1";
}

/**
 * IP-based Sliding Window Rate Limiter for Login and Registration
 * Default: Max 5 attempts per 60 seconds per IP
 */
export function checkAuthIpRateLimit(
  ip: string,
  limit = 5,
  windowMs = 60000
): { allowed: boolean; retryAfterSeconds: number; remaining: number } {
  const now = Date.now();
  const rawTimestamps = authIpStore.get(ip) || [];
  const validTimestamps = rawTimestamps.filter((t) => now - t < windowMs);

  if (validTimestamps.length >= limit) {
    const oldest = validTimestamps[0];
    const retryAfterSeconds = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
    return { allowed: false, retryAfterSeconds, remaining: 0 };
  }

  validTimestamps.push(now);
  authIpStore.set(ip, validTimestamps);

  return {
    allowed: true,
    retryAfterSeconds: 0,
    remaining: Math.max(0, limit - validTimestamps.length),
  };
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  planName: string;
  reason?: "MONTHLY_QUOTA" | "PER_MINUTE_BURST";
  retryAfterSeconds?: number;
}

/**
 * User & Plan Rate Limiter:
 * Checks both per-minute burst rate and monthly quotas.
 */
export function checkAndConsumeLimit(email: string, plan: string): RateLimitResult {
  const cleanEmail = email.toLowerCase().trim();

  // Admin Master Account has completely unlimited access
  if (cleanEmail === "abhiram.b@icloud.com" || cleanEmail === "abhiram.b@icloud.om") {
    return {
      allowed: true,
      remaining: 999999,
      limit: 999999,
      planName: "Max Lifetime VIP (Admin)",
    };
  }

  const normalizedPlan = plan.toLowerCase().includes("max")
    ? "max"
    : plan.toLowerCase().includes("pro")
    ? "pro"
    : plan.toLowerCase().includes("starter")
    ? "starter"
    : "free";

  const config = PLANS_CONFIG[normalizedPlan] || PLANS_CONFIG.free;

  // 1. Enforce Per-Minute Plan Burst Limit
  const now = Date.now();
  const windowMs = 60000;
  const userBurstTimestamps = (planBurstStore.get(cleanEmail) || []).filter((t) => now - t < windowMs);

  if (userBurstTimestamps.length >= config.perMinuteLimit) {
    const oldest = userBurstTimestamps[0];
    const retryAfterSeconds = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
    return {
      allowed: false,
      remaining: 0,
      limit: config.perMinuteLimit,
      planName: config.name,
      reason: "PER_MINUTE_BURST",
      retryAfterSeconds,
    };
  }

  // 2. Enforce Monthly Plan Limit
  const month = currentMonthKey();
  const usageRecord = usageStore.get(cleanEmail) || { count: 0, month };

  if (usageRecord.month !== month) {
    usageRecord.count = 0;
    usageRecord.month = month;
  }

  if (usageRecord.count >= config.monthlyLimit) {
    return {
      allowed: false,
      remaining: 0,
      limit: config.monthlyLimit,
      planName: config.name,
      reason: "MONTHLY_QUOTA",
    };
  }

  // Record valid consumption
  userBurstTimestamps.push(now);
  planBurstStore.set(cleanEmail, userBurstTimestamps);

  usageRecord.count += 1;
  usageStore.set(cleanEmail, usageRecord);

  return {
    allowed: true,
    remaining: Math.max(0, config.monthlyLimit - usageRecord.count),
    limit: config.monthlyLimit,
    planName: config.name,
  };
}

export function getUserUsage(email: string, plan: string): { used: number; remaining: number; limit: number; planName: string } {
  const cleanEmail = email.toLowerCase().trim();
  if (cleanEmail === "abhiram.b@icloud.com" || cleanEmail === "abhiram.b@icloud.om") {
    return {
      used: 0,
      remaining: 999999,
      limit: 999999,
      planName: "Max Lifetime VIP (Admin)",
    };
  }

  const normalizedPlan = plan.toLowerCase().includes("max")
    ? "max"
    : plan.toLowerCase().includes("pro")
    ? "pro"
    : plan.toLowerCase().includes("starter")
    ? "starter"
    : "free";

  const config = PLANS_CONFIG[normalizedPlan] || PLANS_CONFIG.free;
  const month = currentMonthKey();
  const usageRecord = usageStore.get(cleanEmail) || { count: 0, month };
  const used = usageRecord.month === month ? usageRecord.count : 0;

  return {
    used,
    remaining: Math.max(0, config.monthlyLimit - used),
    limit: config.monthlyLimit,
    planName: config.name,
  };
}
