import { beforeEach, describe, expect, it, vi } from "vitest";
import type { SteerChatResult } from "../../shared/types";

const RUNNING_STEER: SteerChatResult = {
  ok: true,
  submission: { promptId: "prompt-steer", createdAt: "2026-11-24T00:00:00.000Z", state: "running", turnId: 7, steered: true },
};

const boundary = vi.hoisted(() => ({
  streamChat: vi.fn(),
  steerChat: vi.fn(),
  abortChat: vi.fn(),
  getSessionBusy: vi.fn(),
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
    getSessionBusy: boundary.getSessionBusy,
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
  boundary.steerChat.mockResolvedValue(RUNNING_STEER);
  boundary.abortChat.mockReset();
  boundary.abortChat.mockResolvedValue({ aborted: true });
  boundary.getSessionBusy.mockReset();
  boundary.getSessionBusy.mockResolvedValue({ busy: true });
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
    composerRestore: null,
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

    expect(boundary.steerChat).toHaveBeenCalledWith("second", expect.any(String));
    expect(boundary.streamChat).toHaveBeenCalledTimes(1);
    expect(useChatStore.getState().queue).toHaveLength(0);
  });

  it("keeps the idle send path unchanged", () => {
    useChatStore.getState().sendMessage("hello");

    expect(boundary.steerChat).not.toHaveBeenCalled();
    expect(boundary.streamChat).toHaveBeenCalledTimes(1);
    expect(useChatStore.getState().pendingInput).toMatchObject({ content: "hello", model: "plain", clientId: expect.any(String) });
  });

  it("shows the first idle send immediately and reconciles its durable turn by clientId", () => {
    useChatStore.getState().sendMessage("first");

    const pending = useChatStore.getState().pendingInput;
    const optimisticUsers = useChatStore.getState().messages.filter((message) => message.role === "user" && message.content === "first");
    expect(optimisticUsers).toHaveLength(1);
    expect(optimisticUsers[0]?.optimistic).toBe(true);
    expect(pending?.clientId).toEqual(expect.any(String));

    useChatStore.getState().processEvent({
      type: "TurnBegin",
      payload: { user_input: "first", clientId: pending!.clientId },
    });
    const users = useChatStore.getState().messages.filter((message) => message.role === "user" && message.content === "first");
    expect(users).toHaveLength(1);
    expect(users[0]?.optimistic).toBe(false);
  });

  it("shows steering immediately and reconciles SteerInput without a nested duplicate", () => {
    let finishSteer: (value: SteerChatResult) => void = () => undefined;
    boundary.steerChat.mockImplementation(() => new Promise((resolve) => { finishSteer = resolve; }));
    useChatStore.getState().sendMessage("first");
    beginTurn();
    useChatStore.getState().sendMessage("second");

    const optimisticUsers = useChatStore.getState().messages.filter((message) => message.role === "user" && message.content === "second");
    expect(optimisticUsers).toHaveLength(1);
    expect(optimisticUsers[0]?.optimistic).toBe(true);
    const clientId = boundary.steerChat.mock.calls[0]?.[1] as string;
    expect(clientId).toEqual(expect.any(String));

    useChatStore.getState().processEvent({ type: "SteerInput", payload: { user_input: "second", clientId } });
    const users = useChatStore.getState().messages.filter((message) => message.role === "user" && message.content === "second");
    expect(users).toHaveLength(1);
    expect(users[0]?.optimistic).toBe(false);
    const assistant = useChatStore.getState().messages.at(-1);
    expect(assistant?.steps?.flatMap((step) => step.items).some((item) => item.type === "steer")).toBe(false);

    finishSteer(RUNNING_STEER);
  });

  it("passes every manual line break unchanged to idle prompts and running-turn steers", () => {
    const prompt = "first thought\nsecond thought\n\nthird paragraph";
    useChatStore.getState().sendMessage(prompt);
    expect(boundary.streamChat.mock.calls[0]?.[0]).toBe(prompt);
    expect(useChatStore.getState().pendingInput?.content).toBe(prompt);

    beginTurn("first");
    const followUp = "correction line one\ncorrection line two";
    useChatStore.getState().sendMessage(followUp);
    expect(boundary.steerChat).toHaveBeenCalledWith(followUp, expect.any(String));
  });

  it("uses a dedicated idle send exactly once when the turn ends during steer", async () => {
    let finishSteer: (value: SteerChatResult) => void = () => undefined;
    boundary.steerChat.mockImplementation(() => new Promise((resolve) => { finishSteer = resolve; }));
    useChatStore.getState().sendMessage("first");
    beginTurn();
    useChatStore.getState().sendMessage("second");
    expect(boundary.steerChat).toHaveBeenCalledWith("second", expect.any(String));
    const clientId = boundary.steerChat.mock.calls[0]?.[1] as string;

    useChatStore.setState({ isStreaming: false });
    finishSteer({ ok: false });

    await vi.waitFor(() => expect(boundary.streamChat).toHaveBeenCalledTimes(2));
    expect(boundary.steerChat).toHaveBeenCalledTimes(1);
    expect(useChatStore.getState().queue).toHaveLength(0);
    expect(useChatStore.getState().messages.filter((message) => message.role === "user" && message.content === "second")).toHaveLength(1);
    useChatStore.getState().processEvent({ type: "TurnBegin", payload: { user_input: "second", clientId } });
    expect(useChatStore.getState().messages.filter((message) => message.role === "user" && message.content === "second")).toHaveLength(1);
    expect(boundary.toastError).not.toHaveBeenCalled();
  });

  it("ignores an older steer rejection after a newer send succeeds", async () => {
    let rejectOlder: (error: Error) => void = () => undefined;
    let acceptNewer: (value: SteerChatResult) => void = () => undefined;
    boundary.steerChat
      .mockImplementationOnce(() => new Promise((_, reject) => { rejectOlder = reject; }))
      .mockImplementationOnce(() => new Promise((resolve) => { acceptNewer = resolve; }));
    useChatStore.getState().sendMessage("first");
    beginTurn();
    useChatStore.getState().sendMessage("older");
    useChatStore.getState().sendMessage("newer");

    acceptNewer(RUNNING_STEER);
    rejectOlder(new Error("late older failure"));

    await vi.waitFor(() => expect(boundary.toastError).toHaveBeenCalled());
    expect(useChatStore.getState().composerRestore).toBeNull();
    expect(useChatStore.getState().messages.some((message) => message.role === "user" && message.content === "newer")).toBe(true);
    expect(boundary.streamChat).toHaveBeenCalledTimes(1);
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
    expect(state.pendingInput).toMatchObject({ content: "first", model: "plain", clientId: expect.any(String) });
    expect(state.draftMedia).toEqual([{ id: "image-1", dataUri: IMAGE }]);
    expect(boundary.streamChat).toHaveBeenCalledTimes(1);
    expect(boundary.toastError.mock.calls[0]?.[0]).toBe("steer failed");
  });

  it("clears media only after an accepted steer acknowledgement", async () => {
    let acceptSteer: (value: SteerChatResult) => void = () => undefined;
    boundary.steerChat.mockImplementation(() => new Promise((resolve) => { acceptSteer = resolve; }));
    useChatStore.getState().sendMessage("first");
    beginTurn();
    useChatStore.setState({
      draftMedia: [{ id: "image-1", dataUri: IMAGE }, { id: "image-2-still-uploading" }],
    });
    useChatStore.getState().sendMessage("look");

    expect(useChatStore.getState().draftMedia).toHaveLength(2);
    acceptSteer(RUNNING_STEER);
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
      "error",
      "approval",
      "question",
    ]);
  });

  it("suppresses notifications while replaying session history", async () => {
    await useChatStore.getState().loadSession("old-session", [
      { type: "error", code: "internal", message: "Historical error" },
    ]);

    expect(boundary.notifyAttention).not.toHaveBeenCalled();
  });

  it("uses the prerecorded error event without speaking the dynamic error text", () => {
    useChatStore.getState().processEvent({ type: "error", code: "quota", message: "Quota exceeded", phase: "runtime" });

    expect(boundary.notifyAttention).toHaveBeenCalledWith("error", DEFAULT_SOUND_SETTINGS.error);
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

  it("uses the approval event without speaking the approval reason", () => {
    useChatStore.getState().processEvent({
      type: "ApprovalRequest",
      payload: { id: "a1", tool_call_id: "t1", sender: "agent", action: "", description: "" },
    });

    expect(boundary.notifyAttention).toHaveBeenCalledWith("approval", DEFAULT_SOUND_SETTINGS.approval);
  });

  it("keeps the running prompt for retry after a rejected steer", async () => {
    boundary.steerChat.mockRejectedValue(new Error("steer failed"));
    useChatStore.getState().sendMessage("original prompt");
    beginTurn("original prompt");
    useChatStore.getState().sendMessage("follow-up");
    await vi.waitFor(() => expect(boundary.toastError).toHaveBeenCalled());

    expect(useChatStore.getState().composerRestore).toBe("follow-up");
    expect(useChatStore.getState().pendingInput).toMatchObject({ content: "original prompt", model: "plain", clientId: expect.any(String) });

    useChatStore.getState().processEvent({ type: "error", code: "internal", message: "Turn failed", phase: "runtime" });
    useChatStore.getState().retryLastMessage();

    expect(boundary.streamChat).toHaveBeenCalledTimes(2);
    expect(boundary.streamChat.mock.calls[1]?.[0]).toBe("original prompt");
  });

  it("keeps media attached during an in-flight steer when the turn has already ended", async () => {
    let finishSteer: (value: SteerChatResult) => void = () => undefined;
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
    const pending: Array<(value: SteerChatResult) => void> = [];
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

    for (const resolve of pending) resolve(RUNNING_STEER);
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

  it("automatically dequeues when the host is already idle and reconciles the entry once", async () => {
    useSettingsStore.setState({ extensionConfig: { ...DEFAULT_EXTENSION_CONFIG, autoSteer: false } });
    boundary.getSessionBusy.mockResolvedValue({ busy: false });
    useChatStore.getState().sendMessage("first");
    beginTurn();
    useChatStore.getState().sendMessage("second");

    expect(useChatStore.getState().queue.map((item) => item.content)).toEqual(["second"]);
    await vi.waitFor(() => expect(boundary.streamChat).toHaveBeenCalledTimes(2));
    expect(useChatStore.getState().queue).toHaveLength(0);
    const pending = useChatStore.getState().pendingInput;
    expect(pending?.content).toBe("second");

    useChatStore.getState().processEvent({
      type: "TurnBegin",
      payload: { user_input: "second", clientId: pending!.clientId },
    });
    expect(useChatStore.getState().messages.filter((message) => message.role === "user" && message.content === "second")).toHaveLength(1);
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
      ["error", sounds.error],
      ["approval", sounds.approval],
      ["question", sounds.question],
      ["turnComplete", sounds.turnComplete],
    ]);
  });

  it("sends an armed goal objective with the next idle message and disarms the goal", () => {
    useChatStore.setState({ goalArmed: true });
    useChatStore.getState().sendMessage("Ship the release");

    expect(boundary.streamChat.mock.calls[0]?.[5]).toEqual({ goalObjective: "Ship the release", clientId: expect.any(String) });
    expect(useChatStore.getState().goalArmed).toBe(false);
  });

  it("sends the permission mode only after the user chose one", () => {
    useChatStore.getState().sendMessage("first");
    expect(boundary.streamChat.mock.calls[0]?.[5]).toEqual({ clientId: expect.any(String) });

    useChatStore.setState({ isStreaming: false, permissionMode: "auto" });
    useChatStore.getState().sendMessage("second");
    expect(boundary.streamChat.mock.calls[1]?.[5]).toEqual({ permissionMode: "auto", clientId: expect.any(String) });
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

  it("restores the working state when live tool events follow replay and clears it on genuine completion", async () => {
    await useChatStore.getState().loadSession("resumed-session", [
      { type: "TurnBegin", payload: { user_input: "Inspect" } },
      { type: "StepBegin", payload: { n: 1 } },
      {
        type: "ToolCall",
        payload: { type: "function", id: "read-old", function: { name: "ReadFile", arguments: "{}" } },
      },
      {
        type: "ToolResult",
        payload: { tool_call_id: "read-old", return_value: { is_error: false, output: "old", message: "", display: [] } },
      },
      { type: "stream_complete", result: { status: "finished" } },
    ]);
    expect(useChatStore.getState().isStreaming).toBe(false);

    useChatStore.getState().processEvent({
      type: "ToolCall",
      payload: { type: "function", id: "read-live", function: { name: "ReadFile", arguments: "{}" } },
    });
    expect(useChatStore.getState().isStreaming).toBe(true);

    useChatStore.getState().processEvent({
      type: "ToolResult",
      payload: { tool_call_id: "read-live", return_value: { is_error: false, output: "live", message: "", display: [] } },
    });
    expect(useChatStore.getState().isStreaming).toBe(true);

    useChatStore.getState().processEvent({ type: "stream_complete", result: { status: "finished" } });
    expect(useChatStore.getState().isStreaming).toBe(false);
  });

  it("keeps model and effort but clears the old session mode and title for a new conversation", async () => {
    useSettingsStore.setState({ currentModel: "reasoning", thinkingEffort: "high" });
    useChatStore.setState({ permissionMode: "manual", sessionTitle: "Old chat" });

    await useChatStore.getState().startNewConversation();
    useChatStore.getState().sendMessage("new conversation");

    expect(useChatStore.getState()).toMatchObject({ permissionMode: null, sessionTitle: null });
    expect(boundary.streamChat).toHaveBeenCalledWith("new conversation", "reasoning", "high", false, undefined, { clientId: expect.any(String) });
  });
});
