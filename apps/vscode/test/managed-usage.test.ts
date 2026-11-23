import { describe, expect, it } from "vitest";

import {
  formatResetCountdown,
  formatTokenCount,
  formatUsagePercent,
  secondaryQuotaWindow,
  toManagedUsageView,
  usageRatio,
} from "../shared/managed-usage";

describe("managed usage mapping", () => {
  it("maps every platform window", () => {
    expect(toManagedUsageView({
      limit5h: { usedRatio: 0.3, resetAt: "2026-09-11T18:00:00Z" },
      limit7d: { usedRatio: 0.2, resetAt: "2026-09-17T00:00:00Z" },
      monthTotal: { usedRatio: 0.4, resetAt: "2026-10-01T00:00:00Z" },
      monthCode: { usedRatio: 0.25, resetAt: "2026-10-01T00:00:00Z" },
    })).toEqual({
      fiveHour: { usedRatio: 0.3, resetAt: "2026-09-11T18:00:00Z" },
      weekly: { usedRatio: 0.2, resetAt: "2026-09-17T00:00:00Z" },
      monthTotal: { usedRatio: 0.4, resetAt: "2026-10-01T00:00:00Z" },
      monthCode: { usedRatio: 0.25, resetAt: "2026-10-01T00:00:00Z" },
    });
  });

  it("omits unreported windows", () => {
    expect(toManagedUsageView({})).toEqual({});
  });

  it("prefers weekly, then monthly code, then monthly total", () => {
    expect(secondaryQuotaWindow({ weekly: { usedRatio: 0.2 }, monthCode: { usedRatio: 0.1 } }))
      .toEqual({ kind: "weekly", window: { usedRatio: 0.2 } });
    expect(secondaryQuotaWindow({ monthTotal: { usedRatio: 0.3 }, monthCode: { usedRatio: 0.1 } }))
      .toEqual({ kind: "monthly", window: { usedRatio: 0.1 } });
    expect(secondaryQuotaWindow({ monthTotal: { usedRatio: 0.3 } }))
      .toEqual({ kind: "monthly", window: { usedRatio: 0.3 } });
    expect(secondaryQuotaWindow({ fiveHour: { usedRatio: 0.5 } })).toBeUndefined();
  });
});

describe("usage formatting", () => {
  it("rounds percentages and guards invalid ratios", () => {
    expect(formatUsagePercent(0.234)).toBe(23.4);
    expect(formatUsagePercent(0.8)).toBe(80);
    expect(formatUsagePercent(1.5)).toBe(100);
    expect(formatUsagePercent(Number.NaN)).toBe(0);
  });

  it("clamps context ratios and rejects invalid capacities", () => {
    expect(usageRatio(25_600, 256_000)).toBe(0.1);
    expect(usageRatio(-1, 100)).toBe(0);
    expect(usageRatio(200, 100)).toBe(1);
    expect(usageRatio(10, 0)).toBe(0);
    expect(usageRatio(Number.NaN, 100)).toBe(0);
  });

  it("formats token counts with binary units and trimmed decimals", () => {
    expect(formatTokenCount(999)).toBe("999");
    expect(formatTokenCount(1024)).toBe("1k");
    expect(formatTokenCount(1536)).toBe("1.5k");
    expect(formatTokenCount(102_400)).toBe("100k");
    expect(formatTokenCount(2.5 * 1024 * 1024)).toBe("2.5M");
    expect(formatTokenCount(-1)).toBe("0");
    expect(formatTokenCount(Number.NaN)).toBe("0");
  });

  it("formats reset countdowns", () => {
    const now = Date.parse("2026-08-10T00:00:00.000Z");
    expect(formatResetCountdown("2026-08-13T02:00:00.000Z", now)).toBe("resets in 3d 2h");
    expect(formatResetCountdown("2026-08-10T02:15:00.000Z", now)).toBe("resets in 2h 15m");
    expect(formatResetCountdown("2026-08-10T00:45:00.000Z", now)).toBe("resets in 45m");
    expect(formatResetCountdown("2026-08-10T00:00:30.000Z", now)).toBe("resets in <1m");
    expect(formatResetCountdown("2026-08-09T23:59:59.000Z", now)).toBe("reset, refreshing...");
    expect(formatResetCountdown(undefined, now)).toBeUndefined();
    expect(formatResetCountdown("not-a-date", now)).toBeUndefined();
  });
});
