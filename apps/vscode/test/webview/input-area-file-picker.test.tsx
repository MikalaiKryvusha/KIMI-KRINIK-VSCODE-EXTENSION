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
    pendingInput: null,
    composerRestore: null,
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

describe("composer restoration", () => {
  it("does not restore pending input whose message is already present", () => {
    useChatStore.setState({
      pendingInput: { content: "steer base", model: "plain", clientId: "client-base" },
      messages: [{ id: "client-base", role: "user", content: "steer base", timestamp: 0, clientId: "client-base" }],
    });
    const { container } = renderInputArea();

    expect(container.querySelector("textarea")?.value).toBe("");
  });

  it("restores a genuinely failed input after its message was removed", () => {
    useChatStore.setState({ pendingInput: { content: "failed text", model: "plain", clientId: "client-failed" } });
    const { container } = renderInputArea();

    expect(container.querySelector("textarea")?.value).toBe("failed text");
  });
});

describe("Control Panel composition", () => {
  it("places Skill immediately after Auto by default", () => {
    renderInputArea();

    expect(screen.getByTestId("permission-mode").style.order).toBe("0");
    expect(screen.getByTestId("skill-picker").style.order).toBe("1");
    expect(screen.getByTestId("mode-compact").style.order).toBe("2");
  });

  it("hides every configured button while keeping the attachment control available", () => {
    useSettingsStore.setState({
      extensionConfig: {
        ...DEFAULT_EXTENSION_CONFIG,
        controlPanel: { permission: false, compact: false, steer: false, control: false, skills: false, plan: false, goal: false, swarm: false, secondaryModel: false },
      },
    });
    renderInputArea();

    expect(screen.queryByTestId("permission-mode")).toBeNull();
    expect(screen.queryByTestId("mode-compact")).toBeNull();
    expect(screen.queryByTestId("mode-steer")).toBeNull();
    expect(screen.queryByTestId("mode-control")).toBeNull();
    expect(screen.queryByTestId("skill-picker")).toBeNull();
    expect(screen.queryByTestId("mode-plan")).toBeNull();
    expect(screen.queryByTestId("mode-goal")).toBeNull();
    expect(screen.queryByTestId("mode-swarm")).toBeNull();
    expect(screen.queryByTestId("secondary-model")).toBeNull();
    expect(screen.getByTestId("attachment-picker-toggle")).not.toBeNull();
  });

  it("shows pointer cursor on attachment, settings, send and stop controls", () => {
    renderInputArea();

    const attachment = screen.getByTestId("attachment-picker-toggle");
    const settings = document.querySelector(".tabler-icon-settings")?.closest("button");
    const send = document.querySelector(".tabler-icon-send")?.closest("button");
    for (const element of [attachment, settings, send]) {
      expect(element?.className).toContain("cursor-pointer");
    }

    cleanup();
    useChatStore.setState({ isStreaming: true });
    renderInputArea();
    expect(screen.getByTestId("stop-indicator").closest("button")?.className).toContain("cursor-pointer");
  });

  it("renders Stop as a filled square rather than an outline icon", () => {
    useChatStore.setState({ isStreaming: true });
    renderInputArea();

    const indicator = screen.getByTestId("stop-indicator");
    expect(indicator.tagName).toBe("SPAN");
    expect(indicator.className).toContain("bg-current");
  });

  it("uses the reference element sides and layers the right actions over a fade", () => {
    renderInputArea();

    const left = screen.getByTestId("control-panel-scroll");
    const right = screen.getByTestId("control-panel-actions");
    expect(left.contains(screen.getByTestId("attachment-picker-toggle"))).toBe(true);
    expect(left.contains(screen.getByTestId("model-picker"))).toBe(false);
    expect(right.contains(screen.getByTestId("model-picker"))).toBe(true);
    expect(right.contains(screen.getByTestId("attachment-picker-toggle"))).toBe(false);
    expect(screen.getByTestId("attachment-picker-toggle").querySelector("svg")?.classList.contains("tabler-icon-paperclip")).toBe(true);
    expect(right.className).toContain("bg-background");
    expect(right.className).toContain("before:right-full");
    expect(right.className).toContain("before:pointer-events-none");
  });

  it("scrolls the left controls with the mouse wheel in both directions", () => {
    renderInputArea();

    const left = screen.getByTestId("control-panel-scroll");
    const content = screen.getByTestId("control-panel-content");
    Object.defineProperties(content, { scrollWidth: { value: 260, configurable: true } });
    Object.defineProperties(left, {
      clientWidth: { value: 100, configurable: true },
      scrollWidth: { value: 260, configurable: true },
      scrollLeft: { value: 0, writable: true, configurable: true },
    });
    const forward = new WheelEvent("wheel", { deltaY: 120, bubbles: true, cancelable: true });
    left.dispatchEvent(forward);
    expect(left.scrollLeft).toBe(120);
    expect(forward.defaultPrevented).toBe(true);

    const backward = new WheelEvent("wheel", { deltaY: -40, bubbles: true, cancelable: true });
    left.dispatchEvent(backward);
    expect(left.scrollLeft).toBe(80);
    expect(backward.defaultPrevented).toBe(true);
  });

  it("disables wheel scrolling when the controls already fit", () => {
    renderInputArea();

    const left = screen.getByTestId("control-panel-scroll");
    const content = screen.getByTestId("control-panel-content");
    Object.defineProperties(content, { scrollWidth: { value: 100, configurable: true } });
    Object.defineProperties(left, {
      clientWidth: { value: 100, configurable: true },
      scrollWidth: { value: 132, configurable: true },
      scrollLeft: { value: 0, writable: true, configurable: true },
    });
    const event = new WheelEvent("wheel", { deltaY: 120, bubbles: true, cancelable: true });
    left.dispatchEvent(event);

    expect(left.scrollLeft).toBe(0);
    expect(event.defaultPrevented).toBe(false);
  });
});
