import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
  vi.stubGlobal("ResizeObserver", class {
    observe() {}
    unobserve() {}
    disconnect() {}
  });
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
  vi.unstubAllGlobals();
  document.body.removeAttribute("data-baseuri");
});

describe("session header", () => {
  it("keeps context percentage out of the top status panel", () => {
    useChatStore.setState({ lastStatus: { context_usage: 0.231 } });
    render(<Header />);

    expect(screen.queryByText("23.1%")).toBeNull();
    expect(screen.queryByTitle("Context Window Usage")).toBeNull();
  });

  it("uses matching rounded borders and 8px Session padding in the header", () => {
    useChatStore.setState({ lastStatus: { context_usage: 0.1 } });
    render(<Header />);

    const session = screen.getByTestId("session-info-trigger");
    const history = screen.getByTestId("session-history-trigger");
    const tokens = screen.getByTestId("token-status-container");
    const newChat = screen.getByTestId("new-chat-trigger");
    for (const element of [session, history, tokens, newChat]) {
      expect(element.className).toContain("rounded-lg");
      expect(element.className).toContain("border-border!");
      expect(element.className).not.toContain("border-border/40");
    }
    expect(tokens.className).not.toContain("rounded-full");
    expect(session.className).toContain("px-2!");
    expect(session.className).not.toContain("pl-px!");
    expect(session.className).not.toContain("pr-1!");
    expect(screen.queryByTitle("Total Input Tokens")).toBeNull();
    expect(screen.queryByTitle("Total Output Tokens")).toBeNull();
  });

  it("shows the localized new-chat tooltip", async () => {
    useSettingsStore.setState({ extensionConfig: { ...DEFAULT_EXTENSION_CONFIG, language: "ru" } });
    const user = userEvent.setup();
    render(<Header />);

    await user.hover(screen.getByTestId("new-chat-trigger"));

    expect(await screen.findByRole("tooltip", { name: "Создать новый чат" })).not.toBeNull();
    await user.hover(screen.getByTestId("session-info-trigger"));
    expect(await screen.findByRole("tooltip", { name: "Показать детали текущего чата" })).not.toBeNull();
  });

  it("shows the KIMI KRINIK robot and the live session title", () => {
    render(<Header />);

    expect(screen.getByText("KIMI KRINIK")).not.toBeNull();
    expect(screen.getByText("· Fix login")).not.toBeNull();
    expect(screen.getByText("· Fix login").className).toContain("@max-[430px]:hidden");
    expect(screen.getByRole("img", { name: "KIMI KRINIK" }).getAttribute("src")).toBe("https://extension.test/resources/krinik-robot-logo.png");
  });
});
