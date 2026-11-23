export interface ManagedUsageWindowView {
  readonly usedRatio: number;
  readonly resetAt?: string;
}

export interface ManagedUsageView {
  readonly fiveHour?: ManagedUsageWindowView;
  readonly weekly?: ManagedUsageWindowView;
  readonly monthTotal?: ManagedUsageWindowView;
  readonly monthCode?: ManagedUsageWindowView;
  readonly planName?: string;
}

export type ManagedUsageResult =
  | { readonly ok: true; readonly usage: ManagedUsageView }
  | { readonly ok: false; readonly error: string };

export interface ManagedQuotaUsagesInput {
  readonly limit5h?: ManagedUsageWindowView;
  readonly limit7d?: ManagedUsageWindowView;
  readonly monthTotal?: ManagedUsageWindowView;
  readonly monthCode?: ManagedUsageWindowView;
}

export function toManagedUsageView(usages: ManagedQuotaUsagesInput): ManagedUsageView {
  return {
    ...(usages.limit5h !== undefined ? { fiveHour: usages.limit5h } : {}),
    ...(usages.limit7d !== undefined ? { weekly: usages.limit7d } : {}),
    ...(usages.monthTotal !== undefined ? { monthTotal: usages.monthTotal } : {}),
    ...(usages.monthCode !== undefined ? { monthCode: usages.monthCode } : {}),
  };
}

export interface SecondaryQuotaWindow {
  readonly kind: "weekly" | "monthly";
  readonly window: ManagedUsageWindowView;
}

export function secondaryQuotaWindow(view: ManagedUsageView): SecondaryQuotaWindow | undefined {
  if (view.weekly !== undefined) return { kind: "weekly", window: view.weekly };
  const month = view.monthCode ?? view.monthTotal;
  if (month !== undefined) return { kind: "monthly", window: month };
  return undefined;
}

export function formatUsagePercent(ratio: number): number {
  if (!Number.isFinite(ratio) || ratio <= 0) return 0;
  return Math.round(Math.min(ratio, 1) * 1000) / 10;
}

export type ResetCountdown =
  | { readonly kind: "refreshing" }
  | { readonly kind: "soon" }
  | { readonly kind: "days"; readonly days: number; readonly hours: number }
  | { readonly kind: "hours"; readonly hours: number; readonly minutes: number }
  | { readonly kind: "minutes"; readonly minutes: number };

export function resetCountdown(resetAt: string | undefined, now: number = Date.now()): ResetCountdown | undefined {
  if (resetAt === undefined) return undefined;
  const parsed = Date.parse(resetAt);
  if (!Number.isFinite(parsed)) return undefined;
  const totalMinutes = Math.floor(Math.floor((parsed - now) / 1000) / 60);
  if (parsed - now <= 0) return { kind: "refreshing" };
  if (totalMinutes < 1) return { kind: "soon" };
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  if (days > 0) return { kind: "days", days, hours };
  if (hours > 0) return { kind: "hours", hours, minutes };
  return { kind: "minutes", minutes };
}

export function formatResetCountdown(resetAt: string | undefined, now: number = Date.now()): string | undefined {
  if (resetAt === undefined) return undefined;
  const parsed = Date.parse(resetAt);
  if (!Number.isFinite(parsed)) return undefined;
  const diffSec = Math.floor((parsed - now) / 1000);
  if (diffSec <= 0) return "reset, refreshing...";
  return `resets in ${formatCountdownDuration(diffSec)}`;
}

function formatCountdownDuration(totalSeconds: number): string {
  const totalMinutes = Math.floor(totalSeconds / 60);
  if (totalMinutes < 1) return "<1m";
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  if (days > 0) return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
  if (hours > 0) return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  return `${minutes}m`;
}
