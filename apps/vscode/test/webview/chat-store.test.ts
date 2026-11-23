import { beforeEach, describe, expect, it, vi } from "vitest";

const boundary = vi.hoisted(() => ({
  streamChat: vi.fn(),
  steerChat: vi.fn(),
  abortChat: vi.fn(),
  trackFiles: vi.fn(),
  toastError: vi.fn(),
  toastWarning: vi.fn(),
  notifyAttention: vi.fn(),
  resetSession: vi.fn(),
  clearTrackedFiles: vi.fn(),
}));

vi.mock("@/services", () => ({
  bridge: {
    streamChat: boundary.streamChat,
    steerChat: boundary.steerChat,
    abortChat: boundary.abortChat,
    trackFiles: boundary.trackFiles,
    resetSession: boundary.resetSession,
    clearTrackedFiles: boundary.clearTrackedFiles,
  },
}));
vi.mock("@/components/ui/sonner", () => ({
  toast: { error: boundary.toastError, warning: boundary.toastWarning },
}));
vi.mock("../../webview-ui/src/lib/attention", () => ({
  notifyAttention: boundary.notifyAttention,
}));

import { DEFAULT_EXTENSION_CONFIG, useSettingsStore } from "../../webview-ui/src/stores/settings.store";
import { DEFAULT_SOUND_SETTINGS } from "../../shared/sounds";
import { useChatStore } from "../../webview-ui/src/stores/chat.store";

const MODELS = [{ id: "plain", name: "Plain", provider: "managed:kimi-code", capabilities: [] }];
const IMAGE = "data:image/png;base64,AAAA";
const IMAGE_2 = "data:image/png;base64,BBBB";

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
  useSettingsStore.setState({ extensionConfig: { ...DEFAULT_EXTENSION_CONFIG } });
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
    swarmMode: false,
    permissionMode: null,
    goal: null,
    goalArmed: false,
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

  it("passes every manual line break unchanged to idle prompts and running-turn steers", () => {
    const prompt = "first thought\nsecond thought\n\nthird paragraph";
    useChatStore.getState().sendMessage(prompt);
    expect(boundary.streamChat.mock.calls[0]?.[0]).toBe(prompt);
    expect(useChatStore.getState().pendingInput?.content).toBe(prompt);

    beginTurn("first");
    const followUp = "correction line one\ncorrection line two";
    useChatStore.getState().sendMessage(followUp);
    expect(boundary.steerChat).toHaveBeenCalledWith(followUp);
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
    expect(state.composerRestore).toBe("look");
    expect(state.pendingInput).toEqual({ content: "first", model: "plain" });
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

  it("speaks the actual error message of a stream error", () => {
    useChatStore.getState().processEvent({ type: "error", code: "quota", message: "Quota exceeded", phase: "runtime" });

    expect(boundary.notifyAttention).toHaveBeenCalledWith("Quota exceeded", DEFAULT_SOUND_SETTINGS.error);
  });

  it("stays silent for non-terminal retry warnings", () => {
    useChatStore.getState().processEvent({
      type: "error",
      code: "retrying",
      message: "Retrying request",
      phase: "runtime",
      terminal: false,
    });

    expect(boundary.notifyAttention).not.toHaveBeenCalled();
    expect(boundary.toastWarning).toHaveBeenCalledWith("Retrying request");
  });

  it("never speaks an empty approval reason", () => {
    useChatStore.getState().processEvent({
      type: "ApprovalRequest",
      payload: { id: "a1", tool_call_id: "t1", sender: "agent", action: "", description: "" },
    });

    expect(boundary.notifyAttention).toHaveBeenCalledWith("Approval required", DEFAULT_SOUND_SETTINGS.approval);
  });

  it("keeps the running prompt for retry after a rejected steer", async () => {
    boundary.steerChat.mockRejectedValue(new Error("steer failed"));
    useChatStore.getState().sendMessage("original prompt");
    beginTurn("original prompt");
    useChatStore.getState().sendMessage("follow-up");
    await vi.waitFor(() => expect(boundary.toastError).toHaveBeenCalled());

    expect(useChatStore.getState().composerRestore).toBe("follow-up");
    expect(useChatStore.getState().pendingInput).toEqual({ content: "original prompt", model: "plain" });

    useChatStore.getState().processEvent({ type: "error", code: "internal", message: "Turn failed", phase: "runtime" });
    useChatStore.getState().retryLastMessage();

    expect(boundary.streamChat).toHaveBeenCalledTimes(2);
    expect(boundary.streamChat.mock.calls[1]?.[0]).toBe("original prompt");
  });

  it("keeps media attached during an in-flight steer when the turn has already ended", async () => {
    let finishSteer: (value: { ok: boolean }) => void = () => undefined;
    boundary.steerChat.mockImplementation(() => new Promise((resolve) => { finishSteer = resolve; }));
    useChatStore.getState().sendMessage("first");
    beginTurn();
    useChatStore.setState({ draftMedia: [{ id: "image-sent", dataUri: IMAGE }] });
    useChatStore.getState().sendMessage("look");
    useChatStore.setState((state) => ({ draftMedia: [...state.draftMedia, { id: "image-late", dataUri: IMAGE_2 }] }));

    useChatStore.setState({ isStreaming: false });
    finishSteer({ ok: false });

    await vi.waitFor(() => expect(boundary.streamChat).toHaveBeenCalledTimes(2));
    expect(boundary.streamChat.mock.calls[1]?.[0]).toMatchObject([
      { type: "text", text: "look" },
      { type: "image_url", image_url: { url: IMAGE } },
    ]);
    expect(useChatStore.getState().draftMedia).toEqual([{ id: "image-late", dataUri: IMAGE_2 }]);
  });

  it("does not resend media that is still waiting for a steer acknowledgement", async () => {
    const pending: Array<(value: { ok: boolean }) => void> = [];
    boundary.steerChat.mockImplementation(() => new Promise((resolve) => { pending.push(resolve); }));
    useChatStore.getState().sendMessage("first");
    beginTurn();
    useChatStore.setState({ draftMedia: [{ id: "image-once", dataUri: IMAGE }] });
    useChatStore.getState().sendMessage("look");
    useChatStore.getState().sendMessage("and this");

    expect(boundary.steerChat.mock.calls[0]?.[0]).toMatchObject([
      { type: "text", text: "look" },
      { type: "image_url", image_url: { url: IMAGE } },
    ]);
    expect(boundary.steerChat.mock.calls[1]?.[0]).toBe("and this");

    for (const resolve of pending) resolve({ ok: true });
    await vi.waitFor(() => expect(useChatStore.getState().draftMedia).toEqual([]));
  });

  it("returns in-flight media to the draft when the steer is rejected", async () => {
    let rejectSteer: (error: Error) => void = () => undefined;
    boundary.steerChat.mockImplementation(() => new Promise((_resolve, reject) => { rejectSteer = reject; }));
    useChatStore.getState().sendMessage("first");
    beginTurn();
    useChatStore.setState({ draftMedia: [{ id: "image-retry", dataUri: IMAGE }] });
    useChatStore.getState().sendMessage("look");

    rejectSteer(new Error("steer failed"));
    await vi.waitFor(() => expect(boundary.toastError).toHaveBeenCalled());
    useChatStore.getState().sendMessage("look again");

    expect(boundary.steerChat.mock.calls[1]?.[0]).toMatchObject([
      { type: "text", text: "look again" },
      { type: "image_url", image_url: { url: IMAGE } },
    ]);
  });

  it("queues a running Enter with its ready attachments when AUTO STEER is off", () => {
    useSettingsStore.setState({ extensionConfig: { ...DEFAULT_EXTENSION_CONFIG, autoSteer: false } });
    useChatStore.getState().sendMessage("first");
    beginTurn();
    useChatStore.setState({ draftMedia: [{ id: "image-queued", dataUri: IMAGE }, { id: "image-uploading" }] });
    useChatStore.getState().sendMessage("second");

    expect(boundary.steerChat).not.toHaveBeenCalled();
    expect(useChatStore.getState().queue).toMatchObject([
      { content: [{ type: "text", text: "second" }, { type: "image_url", image_url: { url: IMAGE } }], model: "plain" },
    ]);
    expect(useChatStore.getState().draftMedia).toEqual([{ id: "image-uploading" }]);
  });

  it("routes each attention event to its own sound setting", () => {
    const sounds = {
      approval: { sound: "chime", volume: 20 },
      question: { sound: "bell", volume: 30 },
      error: { sound: "alert", volume: 40 },
      turnComplete: { sound: "pop", volume: 50 },
    } as const;
    useSettingsStore.setState({ extensionConfig: { ...DEFAULT_EXTENSION_CONFIG, sounds } });

    useChatStore.getState().processEvent({ type: "error", code: "quota", message: "Quota exceeded", phase: "runtime" });
    useChatStore.getState().processEvent({
      type: "ApprovalRequest",
      payload: { id: "a1", tool_call_id: "t1", sender: "agent", action: "run", description: "Run tests" },
    });
    useChatStore.getState().processEvent({
      type: "QuestionRequest",
      payload: { id: "q1", tool_call_id: "t2", questions: [{ question: "Which one?", options: [] }] },
    });
    useChatStore.getState().processEvent({ type: "stream_complete", result: { status: "finished" } });
    useChatStore.getState().processEvent({ type: "stream_complete", result: { status: "cancelled" } });

    expect(boundary.notifyAttention.mock.calls).toEqual([
      ["Quota exceeded", sounds.error],
      ["Approval required: Run tests", sounds.approval],
      ["Which one?", sounds.question],
      ["Done", sounds.turnComplete],
    ]);
  });

  it("sends an armed goal objective with the next idle message and disarms the goal", () => {
    useChatStore.setState({ goalArmed: true });
    useChatStore.getState().sendMessage("Ship the release");

    expect(boundary.streamChat.mock.calls[0]?.[5]).toEqual({ goalObjective: "Ship the release" });
    expect(useChatStore.getState().goalArmed).toBe(false);
  });

  it("sends the permission mode only after the user chose one", () => {
    useChatStore.getState().sendMessage("first");
    expect(boundary.streamChat.mock.calls[0]?.[5]).toEqual({});

    useChatStore.setState({ isStreaming: false, permissionMode: "auto" });
    useChatStore.getState().sendMessage("second");
    expect(boundary.streamChat.mock.calls[1]?.[5]).toEqual({ permissionMode: "auto" });
  });

  it("follows swarm, goal, permission and title from status updates", () => {
    useChatStore.setState({ goalArmed: true });
    useChatStore.getState().processEvent({
      type: "StatusUpdate",
      payload: {
        swarm_mode: true,
        permission: "yolo",
        session_title: "Fix login",
        goal: { objective: "Ship", status: "active", turnsUsed: 1, tokensUsed: 10, wallClockMs: 5 },
      },
    });

    expect(useChatStore.getState()).toMatchObject({
      swarmMode: true,
      permissionMode: "yolo",
      sessionTitle: "Fix login",
      goal: { objective: "Ship", status: "active" },
      goalArmed: false,
    });
  });

  it("keeps model and effort but clears the old session mode and title for a new conversation", async () => {
    useSettingsStore.setState({ currentModel: "reasoning", thinkingEffort: "high" });
    useChatStore.setState({ permissionMode: "manual", sessionTitle: "Old chat" });

    await useChatStore.getState().startNewConversation();
    useChatStore.getState().sendMessage("new conversation");

    expect(useChatStore.getState()).toMatchObject({ permissionMode: null, sessionTitle: null });
    expect(boundary.streamChat).toHaveBeenCalledWith("new conversation", "reasoning", "high", false, undefined, {});
  });
});
