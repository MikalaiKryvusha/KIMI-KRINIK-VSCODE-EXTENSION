import { useEffect, useState } from "react";

import { bridge } from "@/services";
import { getModelById, useSettingsStore } from "@/stores";
import {
  resetCountdown,
  formatUsagePercent,
  secondaryQuotaWindow,
  type ManagedUsageView,
  type ManagedUsageWindowView,
} from "shared/managed-usage";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { t as translateNow, useT } from "@/i18n";

const USAGE_POLL_INTERVAL_MS = 60_000;
const COUNTDOWN_TICK_MS = 60_000;

function quotaRingColor(ratio: number): string | undefined {
  if (ratio < 0.7) return undefined;
  const t = Math.min(1, (ratio - 0.7) / 0.3);
  return `hsl(${Math.round(45 * (1 - t))} 95% 50%)`;
}

function longWindowRingColor(ratio: number): string {
  return `hsl(${Math.round(217 * (1 - Math.min(1, ratio)))} 90% 55%)`;
}

interface RingCirclesProps {
  readonly center: number;
  readonly radius: number;
  readonly strokeWidth: number;
  readonly ratio: number | null;
}

function RingCircles({ center, radius, strokeWidth, ratio }: RingCirclesProps) {
  const circumference = 2 * Math.PI * radius;
  const filled = (ratio ?? 0) * circumference;
  return (
    <>
      <circle cx={center} cy={center} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="opacity-20" />
      {ratio !== null && (
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference - filled}`}
        />
      )}
    </>
  );
}

export interface QuotaWindowState {
  readonly ratio: number | null;
  readonly resetAt?: string;
  readonly error?: string;
}

export function quotaWindowState(
  window: ManagedUsageWindowView | undefined,
  usageError: string | null,
): QuotaWindowState | null {
  if (usageError !== null) return { ratio: null, error: usageError };
  if (window === undefined) return null;
  if (!Number.isFinite(window.usedRatio)) return { ratio: null, error: translateNow("usage.invalidData") };
  return {
    ratio: Math.max(0, Math.min(window.usedRatio, 1)),
    resetAt: window.resetAt,
  };
}

function QuotaTooltipSection({ label, state, now }: { label: string; state: QuotaWindowState; now: number }) {
  const t = useT();
  const countdown = resetCountdown(state.resetAt, now);
  const resetText = countdown === undefined
    ? undefined
    : countdown.kind === "refreshing"
      ? t("usage.resetRefreshing")
      : countdown.kind === "soon"
        ? t("usage.resetsSoon")
        : countdown.kind === "days"
          ? t("usage.resetsInDays", { days: countdown.days, hours: countdown.hours })
          : countdown.kind === "hours"
            ? t("usage.resetsInHours", { hours: countdown.hours, minutes: countdown.minutes })
            : t("usage.resetsInMinutes", { minutes: countdown.minutes });
  return (
    <div className="flex flex-col gap-0.5">
      <span>{label}</span>
      {state.ratio === null ? (
        <span>{state.error !== undefined ? t("usage.unavailable", { error: state.error }) : t("usage.loading")}</span>
      ) : (
        <>
          <span>{t("usage.percentUsed", { percent: formatUsagePercent(state.ratio) })}</span>
          {resetText !== undefined && <span>{resetText}</span>}
        </>
      )}
    </div>
  );
}

export function QuotaRings({
  fiveHour,
  secondary,
  secondaryLabel,
  planName,
  now,
}: {
  fiveHour: QuotaWindowState;
  secondary: QuotaWindowState;
  secondaryLabel: string;
  planName?: string;
  now: number;
}) {
  const size = 18;
  const strokeWidth = 2;
  const outerRadius = (size - strokeWidth) / 2;
  const innerRadius = outerRadius - strokeWidth - 1;
  const t = useT();
  const outerColor = fiveHour.ratio !== null ? quotaRingColor(fiveHour.ratio) : undefined;
  const innerColor = secondary.ratio !== null ? longWindowRingColor(secondary.ratio) : undefined;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="flex items-center" data-testid="quota-rings">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block -rotate-90" aria-hidden="true">
            <g
              className={outerColor !== undefined ? undefined : fiveHour.ratio === null ? "text-muted-foreground/50" : "text-muted-foreground"}
              style={outerColor !== undefined ? { color: outerColor } : undefined}
            >
              <RingCircles center={size / 2} radius={outerRadius} strokeWidth={strokeWidth} ratio={fiveHour.ratio} />
            </g>
            <g
              className={innerColor !== undefined ? undefined : "text-muted-foreground/50"}
              style={innerColor !== undefined ? { color: innerColor } : undefined}
            >
              <RingCircles center={size / 2} radius={innerRadius} strokeWidth={strokeWidth} ratio={secondary.ratio} />
            </g>
          </svg>
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <div className="flex flex-col gap-1.5">
          {planName !== undefined && <span className="font-medium">{t("usage.plan", { name: planName })}</span>}
          <QuotaTooltipSection label={t("usage.fiveHourLimit")} state={fiveHour} now={now} />
          <QuotaTooltipSection label={secondaryLabel} state={secondary} now={now} />
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

export function UsageStatusBar() {
  const currentModel = useSettingsStore((state) => state.currentModel);
  const models = useSettingsStore((state) => state.models);
  const isLoggedIn = useSettingsStore((state) => state.isLoggedIn);
  const managedProvider = (() => {
    const provider = getModelById(models, currentModel)?.provider;
    return provider === "managed:kimi-code" ? provider : undefined;
  })();
  const [usage, setUsage] = useState<ManagedUsageView | null>(null);
  const [usageError, setUsageError] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const t = useT();

  useEffect(() => {
    setUsage(null);
    setUsageError(null);
    if (managedProvider === undefined) return;
    let cancelled = false;
    const refresh = () => {
      bridge
        .getManagedUsage(managedProvider)
        .then((result) => {
          if (cancelled) return;
          if (result.ok) {
            setUsage(result.usage);
            setUsageError(null);
          } else {
            setUsageError(result.error);
          }
        })
        .catch((error: unknown) => {
          if (!cancelled) setUsageError(error instanceof Error ? error.message : String(error));
        });
    };
    refresh();
    const timer = setInterval(refresh, USAGE_POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [managedProvider, isLoggedIn]);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), COUNTDOWN_TICK_MS);
    return () => clearInterval(timer);
  }, []);

  if (managedProvider === undefined) return null;

  let quota: { fiveHour: QuotaWindowState; secondary: QuotaWindowState; secondaryLabel: string } | null = null;
  if (usageError === null && usage === null) {
    quota = { fiveHour: { ratio: null }, secondary: { ratio: null }, secondaryLabel: t("usage.weeklyLimit") };
  } else {
    const fiveHour = quotaWindowState(usage?.fiveHour, usageError);
    const secondarySel = usage !== null ? secondaryQuotaWindow(usage) : undefined;
    const secondary = quotaWindowState(secondarySel?.window, usageError);
    const secondaryLabel = secondarySel?.kind === "monthly" ? t("usage.monthlyLimit") : t("usage.weeklyLimit");
    if (fiveHour !== null || secondary !== null) {
      quota = {
        fiveHour: fiveHour ?? { ratio: null },
        secondary: secondary ?? { ratio: null },
        secondaryLabel,
      };
    }
  }

  if (quota === null) return null;
  return (
    <div className="flex h-6 items-center gap-1.5 select-none">
      <QuotaRings
        fiveHour={quota.fiveHour}
        secondary={quota.secondary}
        secondaryLabel={quota.secondaryLabel}
        planName={usage?.planName}
        now={now}
      />
    </div>
  );
}
