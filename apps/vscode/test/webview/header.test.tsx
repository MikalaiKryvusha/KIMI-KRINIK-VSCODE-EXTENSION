import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/services", () => ({
  Events: {},
  bridge: { getKimiSessions: vi.fn(async () => []), on: vi.fn(() => vi.fn()) },
}));
vi.mock("@/components/ui/sonner", () => ({
  toast: { error: vi.fn(), warning: vi.fn(), info: vi.fn(), success: vi.fn() },
}));

import { Header } from "../../webview-ui/src/components/Header";
import { useChatStore } from "../../webview-ui/src/stores/chat.store";
import { DEFAULT_EXTENSION_CONFIG, useSettingsStore } from "../../webview-ui/src/stores/settings.store";

beforeEach(() => {
  document.body.setAttribute("data-baseuri", "https://extension.test");
  useSettingsStore.setState({ extensionConfig: { ...DEFAULT_EXTENSION_CONFIG } });
  useChatStore.setState({
    sessionId: "session-1",
    sessionTitle: "Fix login",
    messages: [{ id: "m1", role: "user", content: "hello", timestamp: 1 }],
    isStreaming: false,
    lastStatus: null,
  });
});

afterEach(() => {
  cleanup();
  document.body.removeAttribute("data-baseuri");
});

describe("session header", () => {
  it("keeps context percentage out of the top status panel", () => {
    useChatStore.setState({ lastStatus: { context_usage: 0.231 } });
    render(<Header />);

    expect(screen.queryByText("23.1%")).toBeNull();
    expect(screen.queryByTitle("Context Window Usage")).toBeNull();
  });

  it("shows the KIMI KRINIK robot and the live session title", () => {
    render(<Header />);

    expect(screen.getByText("KIMI KRINIK")).not.toBeNull();
    expect(screen.getByText("· Fix login")).not.toBeNull();
    expect(screen.getByText("· Fix login").className).toContain("@max-[430px]:hidden");
    expect(screen.getByRole("img", { name: "KIMI KRINIK" }).getAttribute("src")).toBe("https://extension.test/resources/krinik-robot-logo.png");
  });
});
