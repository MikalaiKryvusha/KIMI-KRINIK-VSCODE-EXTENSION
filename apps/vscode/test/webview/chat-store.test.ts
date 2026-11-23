import { beforeEach, describe, expect, it, vi } from "vitest";

const boundary = vi.hoisted(() => ({
  streamChat: vi.fn(),
  steerChat: vi.fn(),
  abortChat: vi.fn(),
  trackFiles: vi.fn(),
  toastError: vi.fn(),
  toastWarning: vi.fn(),
  notifyAttention: vi.fn(),
}));

vi.mock("@/services", () => ({
  bridge: {
    streamChat: boundary.streamChat,
    steerChat: boundary.steerChat,
    abortChat: boundary.abortChat,
    trackFiles: boundary.trackFiles,
  },
}));
vi.mock("@/components/ui/sonner", () => ({
  toast: { error: boundary.toastError, warning: boundary.toastWarning },
}));
vi.mock("../../webview-ui/src/lib/attention", () => ({
  notifyAttention: boundary.notifyAttention,
}));

import { useSettingsStore } from "../../webview-ui/src/stores/settings.store";
import { useChatStore } from "../../webview-ui/src/stores/chat.store";

const MODELS = [{ id: "plain", name: "Plain", provider: "managed:kimi-code", capabilities: [] }];
const IMAGE = "data:image/png;base64,AAAA";

beforeEach(() => {
  boundary.streamChat.mockReset();
  boundary.streamChat.mockResolvedValue({ done: false });
  boundary.steerChat.mockReset();
  boundary.steerChat.mockResolvedValue({ ok: true });
  boundary.abortChat.mockReset();
  boundary.abortChat.mockResolvedValue({ aborted: true });
  boundary.trackFiles.mockReset();
  boundary.toastError.mockReset();
  boundary.toastWarning.mockReset();
  boundary.notifyAttention.mockReset();
  useSettingsStore.getState().initModels(MODELS, "plain", false);
  useChatStore.setState({
    sessionId: null,
    messages: [],
    isStreaming: false,
    isCompacting: false,
    handshakeReceived: false,
    draftMedia: [],
    lastStatus: null,
    tokenUsage: { input_other: 0, output: 0, input_cache_read: 0, input_cache_creation: 0 },
    activeTokenUsage: { input_other: 0, output: 0, input_cache_read: 0, input_cache_creation: 0 },
    pendingInput: null,
    queue: [],
    pendingQuestion: null,
    planMode: false,
  });
});

function beginTurn(input = "first") {
  useChatStore.getState().processEvent({ type: "TurnBegin", payload: { user_input: input } });
  useChatStore.getState().processEvent({ type: "StepBegin", payload: { n: 1 } });
}

describe("automatic follow-up steer", () => {
  it("steers an ordinary running Enter without queueing", () => {
    useChatStore.getState().sendMessage("first");
    beginTurn();
    useChatStore.getState().sendMessage("second");

    expect(boundary.steerChat).toHaveBeenCalledWith("second");
    expect(boundary.streamChat).toHaveBeenCalledTimes(1);
    expect(useChatStore.getState().queue).toHaveLength(0);
  });

  it("keeps the idle send path unchanged", () => {
    useChatStore.getState().sendMessage("hello");

    expect(boundary.steerChat).not.toHaveBeenCalled();
    expect(boundary.streamChat).toHaveBeenCalledTimes(1);
    expect(useChatStore.getState().pendingInput).toEqual({ content: "hello", model: "plain" });
  });

  it("uses a dedicated idle send exactly once when the turn ends during steer", async () => {
    let finishSteer: (value: { ok: boolean }) => void = () => undefined;
    boundary.steerChat.mockImplementation(() => new Promise((resolve) => { finishSteer = resolve; }));
    useChatStore.getState().sendMessage("first");
    beginTurn();
    useChatStore.getState().sendMessage("second");
    expect(boundary.steerChat).toHaveBeenCalledWith("second");

    useChatStore.setState({ isStreaming: false });
    finishSteer({ ok: false });

    await vi.waitFor(() => expect(boundary.streamChat).toHaveBeenCalledTimes(2));
    expect(boundary.steerChat).toHaveBeenCalledTimes(1);
    expect(useChatStore.getState().queue).toHaveLength(0);
    expect(boundary.toastError).not.toHaveBeenCalled();
  });

  it("restores text and ready media after an actual steer failure", async () => {
    boundary.steerChat.mockRejectedValue(new Error("steer failed"));
    useChatStore.getState().sendMessage("first");
    beginTurn();
    useChatStore.setState({ draftMedia: [{ id: "image-1", dataUri: IMAGE }] });
    useChatStore.getState().sendMessage("look");

    await vi.waitFor(() => expect(boundary.toastError).toHaveBeenCalled());
    const state = useChatStore.getState();
    expect(state.pendingInput).toMatchObject({ restore: true, model: "plain" });
    expect(state.draftMedia).toEqual([{ id: "image-1", dataUri: IMAGE }]);
    expect(boundary.streamChat).toHaveBeenCalledTimes(1);
    expect(boundary.toastError.mock.calls[0]?.[0]).toBe("steer failed");
  });

  it("clears media only after an accepted steer acknowledgement", async () => {
    let acceptSteer: (value: { ok: boolean }) => void = () => undefined;
    boundary.steerChat.mockImplementation(() => new Promise((resolve) => { acceptSteer = resolve; }));
    useChatStore.getState().sendMessage("first");
    beginTurn();
    useChatStore.setState({
      draftMedia: [{ id: "image-1", dataUri: IMAGE }, { id: "image-2-still-uploading" }],
    });
    useChatStore.getState().sendMessage("look");

    expect(useChatStore.getState().draftMedia).toHaveLength(2);
    acceptSteer({ ok: true });
    await vi.waitFor(() => expect(useChatStore.getState().draftMedia).toEqual([{ id: "image-2-still-uploading" }]));
    expect(boundary.steerChat.mock.calls[0]?.[0]).toMatchObject([
      { type: "text", text: "look" },
      { type: "image_url", image_url: { url: IMAGE } },
    ]);
  });

  it("preserves the order of three follow-ups and never queues them", () => {
    useChatStore.getState().sendMessage("first");
    beginTurn();
    useChatStore.getState().sendMessage("second");
    useChatStore.getState().sendMessage("third");
    useChatStore.getState().sendMessage("fourth");

    expect(boundary.steerChat.mock.calls.map((call) => call[0])).toEqual(["second", "third", "fourth"]);
    expect(useChatStore.getState().queue).toHaveLength(0);
    expect(boundary.streamChat).toHaveBeenCalledTimes(1);
  });

  it("notifies on errors, approvals and questions", () => {
    useChatStore.getState().processEvent({ type: "error", code: "internal", message: "Action failed" });
    useChatStore.getState().processEvent({
      type: "ApprovalRequest",
      payload: { id: "a1", tool_call_id: "t1", sender: "agent", action: "run", description: "Run tests" },
    });
    useChatStore.getState().processEvent({
      type: "QuestionRequest",
      payload: { id: "q1", tool_call_id: "t2", questions: [{ question: "Choose next step", options: [] }] },
    });

    expect(boundary.notifyAttention.mock.calls.map((call) => call[0])).toEqual([
      "Action failed",
      "Approval required: Run tests",
      "Choose next step",
    ]);
  });

  it("suppresses notifications while replaying session history", async () => {
    await useChatStore.getState().loadSession("old-session", [
      { type: "error", code: "internal", message: "Historical error" },
    ]);

    expect(boundary.notifyAttention).not.toHaveBeenCalled();
  });
});
