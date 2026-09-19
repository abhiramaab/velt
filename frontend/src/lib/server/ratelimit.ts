export interface PlanLimits {
  name: string;
  monthlyLimit: number;
  unlimited: boolean;
}

export const PLANS_CONFIG: Record<string, PlanLimits> = {
  free: {
    name: "Free Trial",
    monthlyLimit: 3,
    unlimited: false,
  },
  starter: {
    name: "Starter",
    monthlyLimit: 85,
    unlimited: false,
  },
  pro: {
    name: "Pro",
    monthlyLimit: 250,
    unlimited: false,
  },
  max: {
    name: "Max",
    monthlyLimit: 450,
    unlimited: false,
  },
  admin: {
    name: "Max Lifetime VIP",
    monthlyLimit: 999999,
    unlimited: true,
  },
};

// In-memory usage counter (resets monthly or persists in memory/store)
declare global {
  // eslint-disable-next-line no-var
  var __velt_usage: Map<string, { count: number; month: string }> | undefined;
}

if (!globalThis.__velt_usage) {
  globalThis.__velt_usage = new Map();
}

const usageStore = globalThis.__velt_usage!;

function currentMonthKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}`;
}

export function checkAndConsumeLimit(email: string, plan: string): { allowed: boolean; remaining: number; limit: number; planName: string } {
  const cleanEmail = email.toLowerCase().trim();

  // Admin Master Account has completely unlimited access
  if (cleanEmail === "abhiram.b@icloud.com") {
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
    };
  }

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
  if (cleanEmail === "abhiram.b@icloud.com") {
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
