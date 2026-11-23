import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const boundary = vi.hoisted(() => ({ getManagedUsage: vi.fn(), getSessionContext: vi.fn() }));

vi.mock("@/services", () => ({
  bridge: { getManagedUsage: boundary.getManagedUsage, getSessionContext: boundary.getSessionContext },
}));

import { QuotaRings, quotaWindowState, UsageStatusBar } from "../../webview-ui/src/components/UsageStatusBar";
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
