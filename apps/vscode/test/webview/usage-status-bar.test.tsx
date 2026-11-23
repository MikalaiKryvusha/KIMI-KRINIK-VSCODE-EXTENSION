import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const boundary = vi.hoisted(() => ({ getManagedUsage: vi.fn() }));

vi.mock("@/services", () => ({ bridge: { getManagedUsage: boundary.getManagedUsage } }));

import { QuotaRings, quotaWindowState, UsageStatusBar } from "../../webview-ui/src/components/UsageStatusBar";
import { useSettingsStore } from "../../webview-ui/src/stores/settings.store";

beforeEach(() => {
  vi.stubGlobal("ResizeObserver", class {
    observe() {}
    unobserve() {}
    disconnect() {}
  });
  boundary.getManagedUsage.mockReset();
  useSettingsStore.getState().initModels([
    { id: "plain", name: "Plain", provider: "managed:kimi-code", capabilities: [] },
  ], "plain", false);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("quota status", () => {
  it("shows percentages, plan, monthly window and reset countdown", async () => {
    const user = userEvent.setup();
    render(
      <QuotaRings
        fiveHour={{ ratio: 0.234, resetAt: "2026-08-13T02:00:00.000Z" }}
        secondary={{ ratio: 0.8 }}
        secondaryLabel="Monthly quota"
        planName="Pro"
        now={Date.parse("2026-08-10T00:00:00.000Z")}
      />,
    );

    await user.hover(screen.getByTestId("quota-rings"));
    expect((await screen.findAllByText("23.4% used")).length).toBeGreaterThan(0);
    expect(screen.getAllByText("80% used").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Plan: Pro").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Monthly quota").length).toBeGreaterThan(0);
    expect(screen.getAllByText("resets in 3d 2h").length).toBeGreaterThan(0);
  });

  it("renders fetch failure as unavailable rather than zero", async () => {
    boundary.getManagedUsage.mockResolvedValue({ ok: false, error: "quota down" });
    const user = userEvent.setup();
    render(<UsageStatusBar />);

    await user.hover(await screen.findByTestId("quota-rings"));
    expect((await screen.findAllByText("Usage unavailable: quota down")).length).toBeGreaterThan(0);
    expect(screen.queryByText("0% used")).toBeNull();
  });

  it("rejects non-finite usage instead of inventing zero", () => {
    expect(quotaWindowState({ usedRatio: Number.NaN }, null))
      .toEqual({ ratio: null, error: "Invalid usage data" });
  });
});
