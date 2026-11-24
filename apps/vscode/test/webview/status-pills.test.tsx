import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const boundary = vi.hoisted(() => ({
  on: vi.fn(),
  getBackgroundTasks: vi.fn(),
  getSessionContext: vi.fn(),
  steerChat: vi.fn(),
}));

vi.mock("@/services", () => ({
  Events: { FileChangesUpdated: "fileChangesUpdated" },
  bridge: {
    on: boundary.on,
    getBackgroundTasks: boundary.getBackgroundTasks,
    getSessionContext: boundary.getSessionContext,
    steerChat: boundary.steerChat,
  },
}));
vi.mock("@/components/ui/sonner", () => ({
  toast: { error: vi.fn(), warning: vi.fn(), info: vi.fn(), success: vi.fn() },
}));

import { StatusPills } from "../../webview-ui/src/components/StatusPills";
import { useChatStore } from "../../webview-ui/src/stores/chat.store";
import { DEFAULT_EXTENSION_CONFIG, useSettingsStore } from "../../webview-ui/src/stores/settings.store";

const listeners = new Map<string, (data: never) => void>();

beforeEach(() => {
  listeners.clear();
  boundary.on.mockReset();
  boundary.on.mockImplementation((event: string, listener: (data: never) => void) => {
    listeners.set(event, listener);
    return () => listeners.delete(event);
  });
  boundary.getBackgroundTasks.mockReset();
  boundary.getBackgroundTasks.mockResolvedValue({ tasks: [] });
  boundary.getSessionContext.mockReset();
  boundary.getSessionContext.mockResolvedValue({ ok: true, snapshot: { tokenCount: 0, messages: [] } });
  boundary.steerChat.mockReset();
  useSettingsStore.setState({ extensionConfig: { ...DEFAULT_EXTENSION_CONFIG } });
  useChatStore.setState({
    sessionId: "session-1",
    sessionTitle: null,
    messages: [],
    queue: [],
    isStreaming: false,
    isCompacting: false,
    draftMedia: [],
    pendingQuestion: null,
    lastStatus: null,
    planMode: false,
    swarmMode: false,
    permissionMode: null,
    goal: null,
    goalArmed: false,
  });
  vi.stubGlobal("ResizeObserver", class {
    observe() {}
    unobserve() {}
    disconnect() {}
  });
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("live status pills", () => {
  it("shows queued messages and file changes from the existing stores and events", async () => {
    useChatStore.setState({ queue: [{ id: "q1", content: "later", model: "plain" }] });
    render(<StatusPills />);

    expect(screen.getByText("1 Queued")).not.toBeNull();
    listeners.get("fileChangesUpdated")?.([{ path: "src/a.ts", status: "Modified", additions: 3, deletions: 1 }] as never);

    expect(await screen.findByText("1 Changed")).not.toBeNull();
    expect(screen.getByTitle("+3 / −1")).not.toBeNull();
  });

  it("optimistically removes a steered queue item and submits it only once across ten activations", async () => {
    let acceptSteer: (value: { ok: boolean }) => void = () => undefined;
    boundary.steerChat.mockImplementation(() => new Promise((resolve) => { acceptSteer = resolve; }));
    useChatStore.setState({
      isStreaming: true,
      queue: [
        { id: "q1", content: "first", model: "plain" },
        { id: "q2", content: "second", model: "plain" },
      ],
    });
    const user = userEvent.setup();
    render(<StatusPills />);
    await user.click(screen.getByText("2 Queued"));
    const lightning = screen.getAllByTitle("Insert now (steer)")[0]!;

    await user.click(lightning);

    expect(boundary.steerChat).toHaveBeenCalledTimes(1);
    expect(useChatStore.getState().queue.map((item) => item.id)).toEqual(["q2"]);
    for (let index = 0; index < 9; index += 1) lightning.click();
    expect(boundary.steerChat).toHaveBeenCalledTimes(1);

    acceptSteer({ ok: true });
    await vi.waitFor(() => expect(useChatStore.getState().queue.map((item) => item.id)).toEqual(["q2"]));
    expect(boundary.steerChat).toHaveBeenCalledTimes(1);
  });

  it.each(["unaccepted", "rejected"] as const)("restores the same queue item at its original index after an %s steer and permits a deliberate retry", async (outcome) => {
    let settleSteer: (value: { ok: boolean }) => void = () => undefined;
    let rejectSteer: (error: Error) => void = () => undefined;
    boundary.steerChat.mockImplementation(() => new Promise((resolve, reject) => {
      settleSteer = resolve;
      rejectSteer = reject;
    }));
    useChatStore.setState({
      isStreaming: true,
      queue: [
        { id: "q1", content: "first", model: "plain" },
        { id: "q2", content: "second", model: "plain" },
      ],
    });
    const user = userEvent.setup();
    render(<StatusPills />);
    await user.click(screen.getByText("2 Queued"));

    await user.click(screen.getAllByTitle("Insert now (steer)")[0]!);
    expect(useChatStore.getState().queue.map((item) => item.id)).toEqual(["q2"]);

    if (outcome === "unaccepted") settleSteer({ ok: false });
    else rejectSteer(new Error("steer failed"));
    await vi.waitFor(() => expect(useChatStore.getState().queue.map((item) => item.id)).toEqual(["q1", "q2"]));

    boundary.steerChat.mockResolvedValue({ ok: true });
    await user.click(screen.getAllByTitle("Insert now (steer)")[0]!);
    expect(useChatStore.getState().queue.map((item) => item.id)).toEqual(["q2"]);
    expect(boundary.steerChat).toHaveBeenCalledTimes(2);
  });

  it("opens real background process and agent panels", async () => {
    const user = userEvent.setup();
    boundary.getBackgroundTasks.mockResolvedValue({
      tasks: [
        { taskId: "bash-1", kind: "process", description: "pnpm build", status: "running", startedAt: 1, endedAt: null },
        { taskId: "agent-1", kind: "agent", description: "Explore code", status: "completed", startedAt: 1, endedAt: 6 },
      ],
    });
    render(<StatusPills />);

    await user.click(await screen.findByText("Background Bash (1)"));
    expect(await screen.findByText("pnpm build")).not.toBeNull();
    expect(screen.getByText("Bash")).not.toBeNull();

    await user.click(screen.getByText("Sub Agents (1)"));
    expect(await screen.findByText("Explore code")).not.toBeNull();
    expect(screen.getByText("Agent")).not.toBeNull();
  });

  it("uses the last SetTodoList display for the todo panel", async () => {
    const user = userEvent.setup();
    useChatStore.setState({
      messages: [{
        id: "m1",
        role: "assistant",
        content: "",
        timestamp: 1,
        steps: [{
          n: 1,
          items: [{
            type: "tool_use",
            id: "todo-1",
            call: { id: "todo-1", name: "SetTodoList", arguments: null },
            result: {
              display: [{
                type: "todo",
                items: [{ title: "Write tests", status: "done" }, { title: "Ship feature", status: "pending" }],
              }],
            },
          }],
        }],
      }] as never,
    });
    render(<StatusPills />);

    await user.click(screen.getByText("Todos 1/2"));

    expect(screen.getByText("Todos · 1/2 done")).not.toBeNull();
    expect(screen.getByText("Write tests")).not.toBeNull();
    expect(screen.getByText("Ship feature")).not.toBeNull();
  });

  it("opens the context viewer only after compaction", async () => {
    const user = userEvent.setup();
    useChatStore.setState({
      messages: [{ id: "m1", role: "assistant", content: "", timestamp: 1, steps: [{ n: 1, items: [{ type: "compaction" }] }] }] as never,
    });
    render(<StatusPills />);

    await user.click(screen.getByText("Context"));

    expect(await screen.findByText("Current Context")).not.toBeNull();
    expect(boundary.getSessionContext).toHaveBeenCalled();
  });

  it("surfaces a background polling failure instead of hiding it", async () => {
    boundary.getBackgroundTasks.mockRejectedValueOnce(new Error("boom"));
    render(<StatusPills />);

    expect(await screen.findByRole("alert")).toHaveProperty("textContent", "Background tasks unavailable: boom");
  });
});
