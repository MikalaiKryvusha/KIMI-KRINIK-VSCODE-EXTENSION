import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const boundary = vi.hoisted(() => ({ getManagedUsage: vi.fn(), getSessionContext: vi.fn() }));

vi.mock("@/services", () => ({
  bridge: { getManagedUsage: boundary.getManagedUsage, getSessionContext: boundary.getSessionContext },
}));

import { contextRingColor, QuotaRings, quotaWindowState, UsageStatusBar } from "../../webview-ui/src/components/UsageStatusBar";
import { useChatStore } from "../../webview-ui/src/stores/chat.store";
import { useSettingsStore } from "../../webview-ui/src/stores/settings.store";

beforeEach(() => {
  vi.stubGlobal("ResizeObserver", class {
    observe() {}
    unobserve() {}
    disconnect() {}
  });
  boundary.getManagedUsage.mockReset();
  boundary.getSessionContext.mockReset();
  useChatStore.setState({ lastStatus: null });
  useSettingsStore.getState().initModels([
    { id: "plain", name: "Plain", provider: "managed:kimi-code", capabilities: [] },
  ], "plain", false);
});

afterEach(() => {
  cleanup();
  useChatStore.setState({ lastStatus: null });
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("context ring color", () => {
  it("interpolates blue to yellow from 60 to 70 percent and yellow to red-orange from 70 to 80 percent", () => {
    expect(contextRingColor(0.5)).toBe("rgb(59 130 246)");
    expect(contextRingColor(0.6)).toBe("rgb(59 130 246)");
    expect(contextRingColor(0.65)).toBe("rgb(155 167 134)");
    expect(contextRingColor(0.7)).toBe("rgb(250 204 21)");
    expect(contextRingColor(0.75)).toBe("rgb(253 137 11)");
    expect(contextRingColor(0.8)).toBe("rgb(255 69 0)");
    expect(contextRingColor(0.95)).toBe("rgb(255 69 0)");
  });
});

describe("usage status", () => {
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
    expect(screen.getAllByText("5h quota")[0]!.className).toContain("font-semibold");
    expect(screen.getAllByText("Monthly quota")[0]!.className).toContain("font-semibold");
    expect(screen.getAllByText("Monthly quota")[0]!.parentElement?.className).toContain("border-t");
    expect(screen.getAllByText("Monthly quota")[0]!.parentElement?.className).toContain("pt-2");
  });

  it("separates context numbers from the bold inspect label", async () => {
    boundary.getManagedUsage.mockResolvedValue({ ok: true, usage: {} });
    useChatStore.setState({
      lastStatus: { context_usage: 0.5, context_tokens: 1024, max_context_tokens: 2048 },
    });
    const user = userEvent.setup();
    render(<UsageStatusBar />);

    await user.hover(await screen.findByTestId("context-ring"));

    expect((await screen.findAllByText("Context window"))[0]!).toHaveProperty("className", expect.stringContaining("font-semibold"));
    const hint = (await screen.findAllByText("Inspect the current context sent to the model (post-compaction state)"))[0]!;
    expect(hint.className).toContain("font-semibold");
    expect(hint.className).toContain("border-t");
    expect(hint.className).toContain("pt-2");
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

  it("opens the live context from the ring without sending compact", async () => {
    boundary.getManagedUsage.mockResolvedValue({ ok: true, usage: {} });
    boundary.getSessionContext.mockResolvedValue({
      ok: true,
      snapshot: { tokenCount: 5, messages: [{ role: "user", text: "keep this context" }] },
    });
    useChatStore.setState({
      lastStatus: { context_usage: 0.5, context_tokens: 1024, max_context_tokens: 2048 },
    });
    const sendMessage = vi.spyOn(useChatStore.getState(), "sendMessage").mockImplementation(() => {});
    const user = userEvent.setup();
    render(<UsageStatusBar />);

    await user.click(await screen.findByTestId("context-ring"));

    expect(await screen.findByText("Current Context")).not.toBeNull();
    expect(await screen.findByText("keep this context")).not.toBeNull();
    expect(boundary.getSessionContext).toHaveBeenCalledOnce();
    expect(sendMessage).not.toHaveBeenCalled();
  });
});
