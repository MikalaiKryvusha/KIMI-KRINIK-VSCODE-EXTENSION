import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const boundary = vi.hoisted(() => ({
  getProjectFiles: vi.fn(),
  getInputHistory: vi.fn(),
  addInputHistory: vi.fn(),
  on: vi.fn(),
}));

vi.mock("@/services", () => ({
  Events: { InsertMention: "insertMention", FileChangesUpdated: "fileChangesUpdated" },
  bridge: {
    getProjectFiles: boundary.getProjectFiles,
    getInputHistory: boundary.getInputHistory,
    addInputHistory: boundary.addInputHistory,
    on: boundary.on,
  },
}));

import { InputArea } from "../../webview-ui/src/components/inputarea/InputArea";
import { useChatStore } from "../../webview-ui/src/stores/chat.store";
import { DEFAULT_EXTENSION_CONFIG, useSettingsStore } from "../../webview-ui/src/stores/settings.store";

function renderInputArea() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <InputArea />
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  boundary.getProjectFiles.mockReset();
  boundary.getProjectFiles.mockResolvedValue([]);
  boundary.getInputHistory.mockReset();
  boundary.getInputHistory.mockResolvedValue([]);
  boundary.addInputHistory.mockReset();
  boundary.on.mockReset();
  boundary.on.mockReturnValue(vi.fn());
  useSettingsStore.setState({
    extensionConfig: { ...DEFAULT_EXTENSION_CONFIG, controlPanel: { ...DEFAULT_EXTENSION_CONFIG.controlPanel } },
    models: [],
    currentModel: "",
    autoCompact: true,
    autoCompactPending: false,
  });
  useChatStore.setState({
    isStreaming: false,
    draftMedia: [],
    messages: [],
    permissionMode: "auto",
    planMode: false,
    goal: null,
    goalArmed: false,
    swarmMode: false,
    sessionId: null,
  });
  vi.stubGlobal("ResizeObserver", class {
    observe() {}
    unobserve() {}
    disconnect() {}
  });
  Object.defineProperty(HTMLElement.prototype, "scrollIntoView", { value: vi.fn(), configurable: true });
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("attachment picker toggle", () => {
  it("opens once and closes on the second attachment click without reopening", async () => {
    const user = userEvent.setup();
    const { container } = renderInputArea();
    const toggle = screen.getByTestId("attachment-picker-toggle");

    await user.click(toggle);
    expect(await screen.findByText("Select images or videos…")).not.toBeNull();
    expect(container.querySelector("textarea")?.value).toBe("@");

    await user.click(toggle);
    expect(screen.queryByText("Select images or videos…")).toBeNull();
    expect(container.querySelector("textarea")?.value).toBe("");
  });
});

describe("Control Panel composition", () => {
  it("hides every configured button while keeping the attachment control available", () => {
    useSettingsStore.setState({
      extensionConfig: {
        ...DEFAULT_EXTENSION_CONFIG,
        controlPanel: { permission: false, compact: false, steer: false, control: false, plan: false, goal: false, swarm: false },
      },
    });
    renderInputArea();

    expect(screen.queryByTestId("permission-mode")).toBeNull();
    expect(screen.queryByTestId("mode-compact")).toBeNull();
    expect(screen.queryByTestId("mode-steer")).toBeNull();
    expect(screen.queryByTestId("mode-control")).toBeNull();
    expect(screen.queryByTestId("mode-plan")).toBeNull();
    expect(screen.queryByTestId("mode-goal")).toBeNull();
    expect(screen.queryByTestId("mode-swarm")).toBeNull();
    expect(screen.getByTestId("attachment-picker-toggle")).not.toBeNull();
  });

  it("renders Stop as a filled square rather than an outline icon", () => {
    useChatStore.setState({ isStreaming: true });
    renderInputArea();

    const indicator = screen.getByTestId("stop-indicator");
    expect(indicator.tagName).toBe("SPAN");
    expect(indicator.className).toContain("bg-current");
  });
});
