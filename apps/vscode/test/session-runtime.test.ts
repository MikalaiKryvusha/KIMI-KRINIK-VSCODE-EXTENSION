import type {
  ApprovalHandler,
  ApprovalRequest,
  Event,
  JsonObject,
  PermissionMode,
  PromptInput,
  PromptSubmissionResult,
  QuestionHandler,
  QuestionRequest,
  Session,
  SessionSummary,
} from "@moonshot-ai/kimi-code-sdk";
import { describe, expect, it, vi } from "vitest";

import { Events } from "../shared/bridge";
import { runHostSlashCommand } from "../src/handlers/slash-command";
import type { HandlerContext } from "../src/handlers/types";
import type { LegacyApprovalFlags } from "../src/runtime/legacy-approval";
import { SessionRuntime } from "../src/runtime/session-runtime";

vi.mock("vscode", () => ({}));

interface BroadcastRecord {
  readonly event: string;
  readonly data: unknown;
  readonly webviewId?: string;
}

interface BaselineRecord {
  readonly session: Pick<SessionSummary, "id" | "workDir" | "metadata">;
  readonly filePath: string;
  readonly webviewIds: readonly string[];
}

const RUNNING_STEER_RESULT: PromptSubmissionResult = {
  promptId: "prompt-steer-1",
  createdAt: "2026-11-24T00:00:00.000Z",
  state: "running",
  turnId: 7,
  steered: true,
};

interface FakeSessionBoundary {
  readonly session: Session;
  readonly promptInputs: Array<string | PromptInput>;
  readonly steerInputs: Array<string | PromptInput>;
  readonly handlerInstallations: { approval: number; question: number };
  readonly metadataUpdates: JsonObject[];
  readonly setPermissions: PermissionMode[];
  readonly subscriptionCount: () => number;
  readonly cancelCount: () => number;
  readonly cancelCompactionCount: () => number;
  readonly closeCount: () => number;
  emit(event: Event): void;
  setSteerResult(result: PromptSubmissionResult): void;
  rejectNextPrompt(error: Error): void;
  rejectNextMetadataUpdate(error: Error): void;
  requestApproval(request: ApprovalRequest): Promise<Awaited<ReturnType<ApprovalHandler>>>;
  requestQuestion(request: QuestionRequest): Promise<Awaited<ReturnType<QuestionHandler>>>;
}

const DEFAULT_LEGACY_APPROVAL: LegacyApprovalFlags = { yolo: false, afk: false };

function createFakeSession(): FakeSessionBoundary {
  const listeners = new Set<(event: Event) => void>();
  const promptInputs: Array<string | PromptInput> = [];
  const steerInputs: Array<string | PromptInput> = [];
  const handlerInstallations = { approval: 0, question: 0 };
  const metadataUpdates: JsonObject[] = [];
  const setPermissions: PermissionMode[] = [];
  let approvalHandler: ApprovalHandler | undefined;
  let questionHandler: QuestionHandler | undefined;
  let nextPromptError: Error | undefined;
  let nextMetadataError: Error | undefined;
  let subscriptions = 0;
  let cancellations = 0;
  let compactionCancellations = 0;
  let closes = 0;
  let permission: PermissionMode = "manual";
  let steerResult = RUNNING_STEER_RESULT;

  const summary: SessionSummary = {
    id: "session-1",
    workDir: "/workspace",
    sessionDir: "/home/sessions/session-1",
    createdAt: 1,
    updatedAt: 2,
    metadata: { source: "vscode-test" },
  };

  const session = {
    id: summary.id,
    workDir: summary.workDir,
    summary,
    setApprovalHandler(handler: ApprovalHandler | undefined) {
      approvalHandler = handler;
      if (handler !== undefined) handlerInstallations.approval += 1;
    },
    setQuestionHandler(handler: QuestionHandler | undefined) {
      questionHandler = handler;
      if (handler !== undefined) handlerInstallations.question += 1;
    },
    onEvent(listener: (event: Event) => void) {
      subscriptions += 1;
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    async prompt(input: string | PromptInput) {
      promptInputs.push(input);
      if (nextPromptError !== undefined) {
        const error = nextPromptError;
        nextPromptError = undefined;
        throw error;
      }
    },
    async steer(input: string | PromptInput) {
      steerInputs.push(input);
      return steerResult;
    },
    async cancel() {
      cancellations += 1;
    },
    async cancelCompaction() {
      compactionCancellations += 1;
    },
    async getStatus() {
      return {
        thinkingEffort: "off",
        permission,
        planMode: false,
        contextTokens: 0,
        maxContextTokens: 128_000,
        contextUsage: 0,
      };
    },
    async setPermission(mode: PermissionMode) {
      permission = mode;
      setPermissions.push(mode);
    },
    async updateMetadata(patch: JsonObject) {
      if (nextMetadataError !== undefined) {
        const error = nextMetadataError;
        nextMetadataError = undefined;
        throw error;
      }
      metadataUpdates.push(patch);
    },
    async close() {
      closes += 1;
    },
  } as unknown as Session;

  return {
    session,
    promptInputs,
    steerInputs,
    handlerInstallations,
    metadataUpdates,
    setPermissions,
    subscriptionCount: () => subscriptions,
    cancelCount: () => cancellations,
    cancelCompactionCount: () => compactionCancellations,
    closeCount: () => closes,
    emit(event) {
      for (const listener of listeners) listener(event);
    },
    setSteerResult(result) {
      steerResult = result;
    },
    rejectNextPrompt(error) {
      nextPromptError = error;
    },
    rejectNextMetadataUpdate(error) {
      nextMetadataError = error;
    },
    async requestApproval(request) {
      if (approvalHandler === undefined) throw new Error("Approval handler is unavailable");
      return approvalHandler(request);
    },
    async requestQuestion(request) {
      if (questionHandler === undefined) throw new Error("Question handler is unavailable");
      return questionHandler(request);
    },
  };
}

function createRuntime(legacyApproval = DEFAULT_LEGACY_APPROVAL) {
  const sdk = createFakeSession();
  const broadcasts: BroadcastRecord[] = [];
  const baselines: BaselineRecord[] = [];
  const runtime = new SessionRuntime({
    session: sdk.session,
    legacyApproval,
    broadcast: (event, data, webviewId) => broadcasts.push({ event, data, webviewId }),
    captureBaseline: (session, filePath, webviewIds) => {
      baselines.push({ session, filePath, webviewIds });
    },
    log: () => undefined,
  });
  runtime.subscribe("view-1");
  return { runtime, sdk, broadcasts, baselines };
}

function streamData(records: readonly BroadcastRecord[]): unknown[] {
  return records.filter((record) => record.event === Events.StreamEvent).map((record) => record.data);
}

function turnStarted(promptId?: string, turnId = 7): Event {
  return {
    type: "turn.started",
    sessionId: "session-1",
    agentId: "main",
    turnId,
    origin: { kind: "user" },
    ...(promptId === undefined ? {} : { promptId }),
  };
}

function turnEnded(
  reason: "completed" | "cancelled" | "failed",
  error?: Extract<Event, { type: "turn.ended" }>["error"],
  turnId = 7,
): Event {
  return {
    type: "turn.ended",
    sessionId: "session-1",
    agentId: "main",
    turnId,
    reason,
    error,
  };
}

describe("session runtime (adapts one SDK session for subscribed Webviews)", () => {
  it("broadcasts session title updates and refreshes the summary", () => {
    const { runtime, sdk, broadcasts } = createRuntime();

    sdk.emit({ type: "session.meta.updated", sessionId: "session-1", agentId: "main", title: "Fix login" });

    expect(streamData(broadcasts)).toContainEqual({
      type: "StatusUpdate",
      payload: { session_title: "Fix login" },
      _sessionId: "session-1",
    });
    expect(runtime.summary?.title).toBe("Fix login");
  });

  it("announces the current context usage to a subscribed Webview", async () => {
    const { runtime, broadcasts } = createRuntime();

    await runtime.announceStatus("view-1");

    expect(streamData(broadcasts)).toContainEqual({
      type: "StatusUpdate",
      payload: {
        thinking_effort: "off",
        plan_mode: false,
        swarm_mode: false,
        permission: "manual",
        context_usage: 0,
        context_tokens: 0,
        max_context_tokens: 128000,
        goal: null,
      },
      _sessionId: "session-1",
    });
  });

  it("renders a host-only command without making it a forkable core turn", () => {
    const { runtime, broadcasts } = createRuntime();

    runtime.beginHostAction("/clear");
    runtime.emitHostText("The context has been cleared.");
    runtime.completeHostAction();

    expect(streamData(broadcasts)).toEqual([
      {
        type: "TurnBegin",
        payload: { user_input: "/clear", forkable: false },
        _sessionId: "session-1",
      },
      { type: "StepBegin", payload: { n: 1 }, _sessionId: "session-1" },
      {
        type: "ContentPart",
        payload: { type: "text", text: "The context has been cleared." },
        _sessionId: "session-1",
      },
      {
        type: "stream_complete",
        result: { status: "finished" },
        _sessionId: "session-1",
      },
    ]);
  });

  it("cancels a long-running host action and ignores its late completion", async () => {
    const { runtime, sdk, broadcasts } = createRuntime();
    const actionId = runtime.beginHostAction("/init");

    await runtime.cancel();
    runtime.emitHostText("AGENTS.md has been generated.", actionId);
    runtime.completeHostAction("finished", actionId);

    expect(sdk.cancelCount()).toBe(1);
    expect(sdk.cancelCompactionCount()).toBe(1);
    expect(streamData(broadcasts)).toContainEqual({
      type: "stream_complete",
      result: { status: "cancelled" },
      _sessionId: "session-1",
    });
    expect(JSON.stringify(streamData(broadcasts))).not.toContain("has been generated");
  });

  it("does not let a cancelled action finish a newer host command", async () => {
    const { runtime, broadcasts } = createRuntime();
    const initAction = runtime.beginHostAction("/init");
    await runtime.cancel();
    const clearAction = runtime.beginHostAction("/clear");

    runtime.emitHostText("late init result", initAction);
    runtime.completeHostAction("finished", initAction);

    expect(runtime.isBusy).toBe(true);
    runtime.emitHostText("The context has been cleared.", clearAction);
    runtime.completeHostAction("finished", clearAction);
    expect(runtime.isBusy).toBe(false);
    expect(JSON.stringify(streamData(broadcasts))).not.toContain("late init result");
  });

  it("waits for the cancelled turn to settle before running an exclusive operation", async () => {
    const { runtime, sdk } = createRuntime();
    const prompt = runtime.prompt("keep working");
    sdk.emit(turnStarted());
    let operationStarted = false;

    const operation = runtime.runExclusiveAfterCancelling(async () => {
      operationStarted = true;
      return "forked";
    });
    await Promise.resolve();
    await Promise.resolve();

    expect(sdk.cancelCount()).toBe(1);
    expect(operationStarted).toBe(false);
    expect(runtime.isBusy).toBe(true);

    sdk.emit(turnEnded("cancelled"));

    await expect(prompt).resolves.toEqual({ status: "cancelled" });
    await expect(operation).resolves.toBe("forked");
    expect(operationStarted).toBe(true);
    expect(runtime.isBusy).toBe(false);
  });

  it("keeps a public turn action attached to its original slash input", async () => {
    const { runtime, sdk, broadcasts } = createRuntime();

    const result = runtime.runTurnAction("/skill:review carefully", async () => {
      sdk.emit(turnStarted());
      sdk.emit(turnEnded("completed"));
    });

    await expect(result).resolves.toEqual({ status: "finished" });
    expect(streamData(broadcasts)).toContainEqual({
      type: "TurnBegin",
      payload: { user_input: "/skill:review carefully", turnIndex: 7 },
      _sessionId: "session-1",
    });
  });

  it("announces a ready queue batch as soon as its first prompt is accepted", async () => {
    const { runtime, sdk, broadcasts } = createRuntime();
    runtime.subscribe("view-a");

    const completion = runtime.prompt("first", "client-batch", true);
    await vi.waitFor(() => expect(streamData(broadcasts)).toContainEqual({
      type: "QueueBatchReady",
      payload: { clientId: "client-batch" },
      _sessionId: "session-1",
    }));

    sdk.emit(turnStarted());
    sdk.emit(turnEnded("completed"));
    await expect(completion).resolves.toEqual({ status: "finished" });
  });

  it("converts legacy media keys when a prompt crosses the SDK boundary", async () => {
    const { runtime, sdk } = createRuntime();
    const completion = runtime.prompt([
      { type: "text", text: "Describe these files" },
      { type: "image_url", image_url: { url: "data:image/png;base64,AA", id: "image-1" } },
      { type: "video_url", video_url: { url: "file:///workspace/demo.mp4", id: "video-1" } },
    ]);

    sdk.emit(turnStarted());
    sdk.emit(turnEnded("completed"));
    await completion;

    expect(sdk.promptInputs).toEqual([
      [
        { type: "text", text: "Describe these files" },
        { type: "image_url", imageUrl: { url: "data:image/png;base64,AA", id: "image-1" } },
        { type: "video_url", videoUrl: { url: "file:///workspace/demo.mp4", id: "video-1" } },
      ],
    ]);
  });

  it("broadcasts assistant text when the SDK streams a text delta", () => {
    const { sdk, broadcasts } = createRuntime();

    sdk.emit({
      type: "assistant.delta",
      sessionId: "session-1",
      agentId: "main",
      turnId: 7,
      delta: "Implemented",
    });

    expect(streamData(broadcasts)).toContainEqual({
      type: "ContentPart",
      payload: { type: "text", text: "Implemented" },
      turnIndex: 7,
      _sessionId: "session-1",
    });
  });

  it("broadcasts model thinking when the SDK streams a thinking delta", () => {
    const { sdk, broadcasts } = createRuntime();

    sdk.emit({
      type: "thinking.delta",
      sessionId: "session-1",
      agentId: "main",
      turnId: 7,
      delta: "Checking the edge case",
    });

    expect(streamData(broadcasts)).toContainEqual({
      type: "ContentPart",
      payload: { type: "think", think: "Checking the edge case" },
      turnIndex: 7,
      _sessionId: "session-1",
    });
  });

  it("broadcasts a legacy tool call when an SDK tool starts", () => {
    const { sdk, broadcasts } = createRuntime();

    sdk.emit({
      type: "tool.call.started",
      sessionId: "session-1",
      agentId: "main",
      origin: "loop",
      turnId: 7,
      toolCallId: "tool-1",
      name: "Read",
      args: { path: "src/index.ts" },
    });

    expect(streamData(broadcasts)).toContainEqual({
      type: "ToolCall",
      payload: {
        type: "function",
        id: "tool-1",
        function: { name: "ReadFile", arguments: '{"path":"src/index.ts"}' },
      },
      _sessionId: "session-1",
    });
  });

  it.each([
    ["completed", "finished"],
    ["cancelled", "cancelled"],
  ] as const)(
    "emits one stream completion when a turn ends as %s",
    async (reason, expectedStatus) => {
      const { runtime, sdk, broadcasts } = createRuntime();
      const completion = runtime.prompt("hello");
      sdk.emit(turnStarted());

      sdk.emit(turnEnded(reason));
      sdk.emit(turnEnded(reason));

      await expect(completion).resolves.toEqual({ status: expectedStatus });
      expect(
        streamData(broadcasts).filter(
          (event) =>
            typeof event === "object" &&
            event !== null &&
            "type" in event &&
            event.type === "stream_complete",
        ),
      ).toEqual([
        {
          type: "stream_complete",
          result: { status: expectedStatus },
          turnIndex: 7,
          _sessionId: "session-1",
        },
      ]);
    },
  );

  it("emits one error when a failed turn terminal is repeated", async () => {
    const { runtime, sdk, broadcasts } = createRuntime();
    const completion = runtime.prompt("hello");
    const error = {
      code: "provider.api_error" as const,
      message: "Provider rejected the request",
      retryable: true,
    };
    sdk.emit(turnStarted());

    sdk.emit(turnEnded("failed", error));
    sdk.emit(turnEnded("failed", error));

    await expect(completion).resolves.toEqual({ status: "failed" });
    expect(
      streamData(broadcasts).filter(
        (event) =>
          typeof event === "object" && event !== null && "type" in event && event.type === "error",
      ),
    ).toHaveLength(1);
  });

  it("suppresses the trailing SDK error when a failed terminal already reported the same error", async () => {
    const { runtime, sdk, broadcasts } = createRuntime();
    const completion = runtime.prompt("hello");
    const error = {
      code: "provider.api_error" as const,
      message: "Provider rejected the request",
      retryable: true,
    };
    sdk.emit(turnStarted());

    sdk.emit(turnEnded("failed", error));
    sdk.emit({
      type: "error",
      sessionId: "session-1",
      agentId: "main",
      ...error,
    });

    await completion;
    expect(
      streamData(broadcasts).filter(
        (event) =>
          typeof event === "object" && event !== null && "type" in event && event.type === "error",
      ),
    ).toHaveLength(1);
  });

  it("reports a preflight error when SDK prompt setup throws before turn start", async () => {
    const { runtime, sdk, broadcasts } = createRuntime();
    sdk.rejectNextPrompt(new Error("Unable to initialize provider"));

    await expect(runtime.prompt("hello")).resolves.toEqual({ status: "failed" });

    expect(streamData(broadcasts)).toContainEqual({
      type: "error",
      code: "internal",
      message: "Internal error occurred.",
      detail: "Unable to initialize provider",
      phase: "preflight",
      _sessionId: "session-1",
    });
  });

  it("requests SDK cancellation when the active response is stopped", async () => {
    const { runtime, sdk } = createRuntime();
    void runtime.prompt("hello");

    await runtime.cancel();

    expect(sdk.cancelCount()).toBe(1);
  });

  it("still reaches the SDK cancel when the host lost track of active work", async () => {
    const { runtime, sdk } = createRuntime();

    await runtime.cancel();

    expect(sdk.cancelCount()).toBe(1);
  });

  it("converts legacy media keys when steering an active response", async () => {
    const { runtime, sdk } = createRuntime();
    void runtime.prompt("hello");

    await runtime.steer([
      { type: "text", text: "Use this instead" },
      { type: "image_url", image_url: { url: "file:///workspace/new.png" } },
    ]);

    expect(sdk.steerInputs).toEqual([
      [
        { type: "text", text: "Use this instead" },
        { type: "image_url", imageUrl: { url: "file:///workspace/new.png" } },
      ],
    ]);
  });

  it("echoes a successful steer into the subscribed Webview with its clientId", async () => {
    const { runtime, broadcasts } = createRuntime();
    runtime.subscribe("view-a");

    await runtime.steer("Use this instead", "client-steer-1");

    expect(streamData(broadcasts)).toContainEqual({
      type: "SteerInput",
      payload: { user_input: "Use this instead", clientId: "client-steer-1" },
      turnIndex: 7,
      _sessionId: "session-1",
    });
  });

  it("returns a new running steer as its own correlated turn", async () => {
    const { runtime, sdk, broadcasts } = createRuntime();
    runtime.subscribe("view-a");
    sdk.setSteerResult({ ...RUNNING_STEER_RESULT, steered: false });

    await expect(runtime.steer("Use this instead", "client-steer-1")).resolves.toEqual({ ...RUNNING_STEER_RESULT, steered: false });

    expect(streamData(broadcasts)).toContainEqual({
      type: "TurnBegin",
      payload: { user_input: "Use this instead", turnIndex: 7, clientId: "client-steer-1" },
      _sessionId: "session-1",
    });
    expect(streamData(broadcasts)).not.toContainEqual(expect.objectContaining({ type: "SteerInput" }));
  });

  it("keeps a queued steer correlated until its prompt starts", async () => {
    const { runtime, sdk, broadcasts } = createRuntime();
    const queued = { promptId: "prompt-queued", createdAt: "2026-11-24T00:00:00.000Z", state: "queued", steered: false } as const;
    sdk.setSteerResult(queued);

    await expect(runtime.steer("Queue this", "client-queued")).resolves.toEqual(queued);
    expect(streamData(broadcasts)).not.toContainEqual(expect.objectContaining({ type: "SteerInput" }));

    sdk.emit(turnStarted("prompt-queued"));
    expect(streamData(broadcasts)).toContainEqual({
      type: "TurnBegin",
      payload: { user_input: "Queue this", turnIndex: 7, clientId: "client-queued" },
      _sessionId: "session-1",
    });
  });

  it("suppresses completion until every immediate steering turn is idle", async () => {
    const { runtime, sdk, broadcasts } = createRuntime();
    const completion = runtime.prompt("first");
    sdk.emit(turnStarted(undefined, 1));
    sdk.setSteerResult({ ...RUNNING_STEER_RESULT, turnId: 2 });
    await runtime.steer("second", "client-steer-2");
    sdk.emit(turnStarted(undefined, 2));

    sdk.emit(turnEnded("completed", undefined, 1));
    expect(streamData(broadcasts)).not.toContainEqual(expect.objectContaining({ type: "stream_complete" }));

    sdk.emit(turnEnded("completed", undefined, 2));
    const completions = streamData(broadcasts).filter((event) => typeof event === "object" && event !== null
      && "type" in event && event.type === "stream_complete" && "result" in event
      && (event.result as { status?: string }).status === "finished");
    expect(completions).toHaveLength(1);
    expect(completions[0]).toMatchObject({ turnIndex: 2 });
    await expect(completion).resolves.toEqual({ status: "finished" });
  });

  it("suppresses completion when the previous turn ends before an accepted steering turn starts", async () => {
    const { runtime, sdk, broadcasts } = createRuntime();
    const completion = runtime.prompt("first");
    sdk.emit(turnStarted(undefined, 1));
    sdk.setSteerResult({ ...RUNNING_STEER_RESULT, turnId: 2, steered: false });
    await runtime.steer("second", "client-steer-2");

    sdk.emit(turnEnded("completed", undefined, 1));
    expect(streamData(broadcasts)).not.toContainEqual(expect.objectContaining({ type: "stream_complete" }));

    sdk.emit(turnStarted(undefined, 2));
    sdk.emit(turnEnded("completed", undefined, 2));
    const completions = streamData(broadcasts).filter((event) => typeof event === "object" && event !== null
      && "type" in event && event.type === "stream_complete" && "result" in event
      && (event.result as { status?: string }).status === "finished");
    expect(completions).toHaveLength(1);
    expect(completions[0]).toMatchObject({ turnIndex: 2 });
    await expect(completion).resolves.toEqual({ status: "finished" });
  });

  it("defers completion while a steering submission is being accepted", async () => {
    const { runtime, sdk, broadcasts } = createRuntime();
    const completion = runtime.prompt("first");
    sdk.emit(turnStarted(undefined, 1));
    sdk.setSteerResult({ ...RUNNING_STEER_RESULT, turnId: 2, steered: true });
    const steering = runtime.steer("second", "client-steer-2");

    sdk.emit(turnEnded("completed", undefined, 1));
    expect(streamData(broadcasts)).not.toContainEqual(expect.objectContaining({ type: "stream_complete" }));

    await steering;
    sdk.emit(turnStarted(undefined, 2));
    sdk.emit(turnEnded("completed", undefined, 2));
    const completions = streamData(broadcasts).filter((event) => typeof event === "object" && event !== null
      && "type" in event && event.type === "stream_complete" && "result" in event
      && (event.result as { status?: string }).status === "finished");
    expect(completions).toHaveLength(1);
    expect(completions[0]).toMatchObject({ turnIndex: 2 });
    await expect(completion).resolves.toEqual({ status: "finished" });
  });

  it("keeps a fallback prompt and steering responses correlated with their own turns", async () => {
    const { runtime, sdk, broadcasts } = createRuntime();
    const initial = runtime.prompt("first", "client-first");
    sdk.emit(turnStarted(undefined, 0));
    sdk.setSteerResult({ ...RUNNING_STEER_RESULT, turnId: 1, steered: true });
    await runtime.steer("first steer", "client-steer-1");
    sdk.emit(turnEnded("completed", undefined, 0));
    await expect(initial).resolves.toEqual({ status: "finished" });
    sdk.emit(turnStarted(undefined, 1));

    const fallback = runtime.prompt("second", "client-second");
    sdk.emit({
      type: "assistant.delta",
      sessionId: "session-1",
      agentId: "main",
      turnId: 1,
      delta: "first response",
    });
    sdk.emit(turnEnded("completed", undefined, 1));

    expect(await Promise.race([fallback, Promise.resolve("pending" as const)])).toBe("pending");
    sdk.emit(turnStarted(undefined, 2));
    expect(streamData(broadcasts)).toContainEqual({
      type: "TurnBegin",
      payload: { user_input: "second", turnIndex: 2, clientId: "client-second" },
      _sessionId: "session-1",
    });
    expect(streamData(broadcasts)).toContainEqual({
      type: "SteerInput",
      payload: { user_input: "first steer", clientId: "client-steer-1" },
      turnIndex: 1,
      _sessionId: "session-1",
    });

    sdk.emit(turnEnded("completed", undefined, 2));
    await expect(fallback).resolves.toEqual({ status: "finished" });
  });

  it("does not resurrect a non-steered turn that finished before its acknowledgement", async () => {
    const { runtime, sdk, broadcasts } = createRuntime();
    const completion = runtime.prompt("first");
    sdk.emit(turnStarted(undefined, 1));
    let acknowledge!: (result: PromptSubmissionResult) => void;
    vi.spyOn(sdk.session, "steer").mockImplementationOnce(() => new Promise((resolve) => {
      acknowledge = resolve;
    }));
    const steering = runtime.steer("second", "client-steer-2");

    sdk.emit(turnEnded("completed", undefined, 1));
    sdk.emit(turnStarted(undefined, 2));
    sdk.emit(turnEnded("completed", undefined, 2));
    acknowledge({ ...RUNNING_STEER_RESULT, turnId: 2, steered: false });
    await steering;

    const completions = streamData(broadcasts).filter((event) => typeof event === "object" && event !== null
      && "type" in event && event.type === "stream_complete" && "result" in event
      && (event.result as { status?: string }).status === "finished");
    expect(completions).toHaveLength(1);
    expect(completions[0]).toMatchObject({ turnIndex: 2 });
    await expect(completion).resolves.toEqual({ status: "finished" });
  });

  it("allows a later same-turn terminal after acceptance to complete", async () => {
    const { runtime, sdk, broadcasts } = createRuntime();
    const completion = runtime.prompt("first");
    sdk.emit(turnStarted(undefined, 1));
    sdk.setSteerResult({ ...RUNNING_STEER_RESULT, turnId: 1, steered: true });
    const steering = runtime.steer("joined", "client-steer-joined");

    sdk.emit(turnEnded("completed", undefined, 1));
    expect(streamData(broadcasts)).not.toContainEqual(expect.objectContaining({ type: "stream_complete" }));

    await steering;
    sdk.emit(turnEnded("completed", undefined, 1));
    const completions = streamData(broadcasts).filter((event) => typeof event === "object" && event !== null
      && "type" in event && event.type === "stream_complete" && "result" in event
      && (event.result as { status?: string }).status === "finished");
    expect(completions).toHaveLength(1);
    expect(completions[0]).toMatchObject({ turnIndex: 1 });
    await expect(completion).resolves.toEqual({ status: "finished" });
  });

  it("releases completion when a pending steering submission is blocked", async () => {
    const { runtime, sdk, broadcasts } = createRuntime();
    const completion = runtime.prompt("first");
    sdk.emit(turnStarted(undefined, 1));
    const blocked = { promptId: "prompt-blocked", createdAt: "2026-11-24T00:00:00.000Z", state: "blocked", steered: false } as const;
    sdk.setSteerResult(blocked);
    const steering = runtime.steer("blocked", "client-steer-blocked");

    sdk.emit(turnEnded("completed", undefined, 1));
    expect(streamData(broadcasts)).not.toContainEqual(expect.objectContaining({ type: "stream_complete" }));

    await expect(steering).resolves.toEqual(blocked);
    const completions = streamData(broadcasts).filter((event) => typeof event === "object" && event !== null
      && "type" in event && event.type === "stream_complete" && "result" in event
      && (event.result as { status?: string }).status === "finished");
    expect(completions).toHaveLength(1);
    expect(completions[0]).toMatchObject({ turnIndex: 1 });
    await expect(completion).resolves.toEqual({ status: "finished" });
  });

  it("emits completion when a same-turn steering submission reaches idle", async () => {
    const { runtime, sdk, broadcasts } = createRuntime();
    const completion = runtime.prompt("first");
    sdk.emit(turnStarted(undefined, 1));
    sdk.setSteerResult({ ...RUNNING_STEER_RESULT, turnId: 1, steered: true });
    await runtime.steer("joined", "client-steer-joined");

    sdk.emit(turnEnded("completed", undefined, 1));
    const completions = streamData(broadcasts).filter((event) => typeof event === "object" && event !== null
      && "type" in event && event.type === "stream_complete" && "result" in event
      && (event.result as { status?: string }).status === "finished");
    expect(completions).toHaveLength(1);
    expect(completions[0]).toMatchObject({ turnIndex: 1 });
    await expect(completion).resolves.toEqual({ status: "finished" });
  });

  it("suppresses completion while an accepted queued steer still waits for its turn", async () => {
    const { runtime, sdk, broadcasts } = createRuntime();
    const completion = runtime.prompt("first");
    sdk.emit(turnStarted(undefined, 1));
    const queued = { promptId: "prompt-queued", createdAt: "2026-11-24T00:00:00.000Z", state: "queued", steered: false } as const;
    sdk.setSteerResult(queued);
    await runtime.steer("queued second", "client-queued-2");

    sdk.emit(turnEnded("completed", undefined, 1));
    expect(streamData(broadcasts)).not.toContainEqual(expect.objectContaining({ type: "stream_complete" }));

    sdk.emit(turnStarted("prompt-queued", 2));
    sdk.emit(turnEnded("completed", undefined, 2));
    const completions = streamData(broadcasts).filter((event) => typeof event === "object" && event !== null
      && "type" in event && event.type === "stream_complete" && "result" in event
      && (event.result as { status?: string }).status === "finished");
    expect(completions).toHaveLength(1);
    expect(completions[0]).toMatchObject({ turnIndex: 2 });
    await expect(completion).resolves.toEqual({ status: "finished" });
  });

  it("defers host completion while a queued steering submission is being accepted", async () => {
    const { runtime, sdk, broadcasts } = createRuntime();
    const actionId = runtime.beginHostAction("/compact");
    const queued = { promptId: "prompt-queued", createdAt: "2026-11-24T00:00:00.000Z", state: "queued", steered: false } as const;
    sdk.setSteerResult(queued);
    const steering = runtime.steer("queued second", "client-queued-2");

    runtime.completeHostAction("finished", actionId);
    expect(streamData(broadcasts)).not.toContainEqual(expect.objectContaining({ type: "stream_complete" }));

    await steering;
    sdk.emit(turnStarted("prompt-queued", 2));
    sdk.emit(turnEnded("completed", undefined, 2));
    const completions = streamData(broadcasts).filter((event) => typeof event === "object" && event !== null
      && "type" in event && event.type === "stream_complete" && "result" in event
      && (event.result as { status?: string }).status === "finished");
    expect(completions).toHaveLength(1);
    expect(completions[0]).toMatchObject({ turnIndex: 2 });
  });

  it("releases host completion without a turn index when a pending steering submission is blocked", async () => {
    const { runtime, sdk, broadcasts } = createRuntime();
    const actionId = runtime.beginHostAction("/compact");
    const blocked = { promptId: "prompt-blocked", createdAt: "2026-11-24T00:00:00.000Z", state: "blocked", steered: false } as const;
    sdk.setSteerResult(blocked);
    const steering = runtime.steer("blocked", "client-steer-blocked");

    runtime.completeHostAction("finished", actionId);
    expect(streamData(broadcasts)).not.toContainEqual(expect.objectContaining({ type: "stream_complete" }));

    await expect(steering).resolves.toEqual(blocked);
    const completions = streamData(broadcasts).filter((event) => typeof event === "object" && event !== null
      && "type" in event && event.type === "stream_complete" && "result" in event
      && (event.result as { status?: string }).status === "finished");
    expect(completions).toHaveLength(1);
    expect(completions[0]).not.toHaveProperty("turnIndex");
  });

  it("returns a blocked steer without emitting a success echo", async () => {
    const { runtime, sdk, broadcasts } = createRuntime();
    const blocked = { promptId: "prompt-blocked", createdAt: "2026-11-24T00:00:00.000Z", state: "blocked", steered: false } as const;
    sdk.setSteerResult(blocked);

    await expect(runtime.steer("Blocked", "client-blocked")).resolves.toEqual(blocked);
    expect(streamData(broadcasts)).not.toContainEqual(expect.objectContaining({ type: "SteerInput" }));
  });

  it("correlates an ordinary turn with the clientId from its prompt", async () => {
    const { runtime, sdk, broadcasts } = createRuntime();
    const completion = runtime.prompt("hello", "client-turn-1");

    sdk.emit(turnStarted());

    expect(streamData(broadcasts)).toContainEqual({
      type: "TurnBegin",
      payload: { user_input: "hello", turnIndex: 7, clientId: "client-turn-1" },
      _sessionId: "session-1",
    });
    sdk.emit(turnEnded("completed"));
    await expect(completion).resolves.toEqual({ status: "finished" });
  });

  it.each([
    ["approve", { decision: "approved" }],
    ["approve_for_session", { decision: "approved", scope: "session" }],
    ["reject", { decision: "rejected" }],
  ] as const)("resolves SDK approval when the Webview responds with %s", async (response, expected) => {
    const { runtime, sdk, broadcasts } = createRuntime();
    const pending = sdk.requestApproval({
      toolCallId: "tool-1",
      toolName: "Bash",
      action: "Run command",
      display: { kind: "command", command: "pnpm test" },
    });
    const request = streamData(broadcasts).find(
      (event) =>
        typeof event === "object" &&
        event !== null &&
        "type" in event &&
        event.type === "ApprovalRequest",
    ) as { payload: { id: string } };

    expect(runtime.respondApproval(request.payload.id, response)).toBe(true);
    await expect(pending).resolves.toEqual(expected);
  });

  it("forwards SDK approval requests to the Webview in legacy yolo mode", async () => {
    const { runtime, sdk, broadcasts } = createRuntime({ yolo: true, afk: false });
    const pending = sdk.requestApproval({
      toolCallId: "tool-yolo",
      toolName: "Bash",
      action: "Run command",
      display: { kind: "command", command: "pnpm test" },
    });
    const request = streamData(broadcasts).find(
      (event) =>
        typeof event === "object" &&
        event !== null &&
        "type" in event &&
        event.type === "ApprovalRequest",
    ) as { payload: { id: string } };

    expect(runtime.respondApproval(request.payload.id, "approve")).toBe(true);
    await expect(pending).resolves.toEqual({ decision: "approved" });
  });

  it("restores core permission when a legacy flag cannot be persisted", async () => {
    const { runtime, sdk } = createRuntime();
    sdk.rejectNextMetadataUpdate(new Error("state is read-only"));

    await expect(runtime.toggleLegacyApproval("afk")).rejects.toThrow("state is read-only");

    expect(sdk.setPermissions).toEqual(["auto", "manual"]);
    expect(runtime.legacyApprovalFlags).toEqual({ yolo: false, afk: false });
  });

  it("resolves an SDK question when the Webview submits answers", async () => {
    const { runtime, sdk, broadcasts } = createRuntime();
    const pending = sdk.requestQuestion({
      toolCallId: "question-1",
      questions: [
        {
          question: "Choose a target",
          header: "Target",
          options: [{ label: "Tests", description: "Run focused tests" }],
          multiSelect: false,
        },
      ],
    });
    const request = streamData(broadcasts).find(
      (event) =>
        typeof event === "object" &&
        event !== null &&
        "type" in event &&
        event.type === "QuestionRequest",
    ) as { payload: { id: string } };

    expect(runtime.respondQuestion(request.payload.id, { "Choose a target": "Tests" })).toBe(true);
    await expect(pending).resolves.toEqual({ answers: { "Choose a target": "Tests" } });
  });

  it("keeps SDK questions interactive in legacy yolo mode", async () => {
    const { runtime, sdk, broadcasts } = createRuntime({ yolo: true, afk: false });
    const pending = sdk.requestQuestion({
      toolCallId: "question-yolo",
      questions: [
        {
          question: "Continue?",
          options: [{ label: "Yes" }],
          multiSelect: false,
        },
      ],
    });
    const request = streamData(broadcasts).find(
      (event) =>
        typeof event === "object" &&
        event !== null &&
        "type" in event &&
        event.type === "QuestionRequest",
    ) as { payload: { id: string } };

    expect(runtime.respondQuestion(request.payload.id, { "Continue?": "Yes" })).toBe(true);
    await expect(pending).resolves.toEqual({ answers: { "Continue?": "Yes" } });
  });

  it("cancels a pending SDK approval when the session closes", async () => {
    const { runtime, sdk } = createRuntime();
    const pending = sdk.requestApproval({
      toolCallId: "tool-1",
      toolName: "Bash",
      action: "Run command",
      display: { kind: "command", command: "pnpm test" },
    });

    await runtime.close();

    await expect(pending).resolves.toEqual({
      decision: "cancelled",
      feedback: "Session closed",
    });
  });

  it("cancels a pending SDK question when the session closes", async () => {
    const { runtime, sdk } = createRuntime();
    const pending = sdk.requestQuestion({
      questions: [
        { question: "Continue?", options: [{ label: "Yes" }], multiSelect: false },
      ],
    });

    await runtime.close();

    await expect(pending).resolves.toBeNull();
  });

  it("fans out one SDK subscription to every Webview attached to the session", () => {
    const { runtime, sdk, broadcasts } = createRuntime();
    runtime.subscribe("view-2");

    sdk.emit({
      type: "assistant.delta",
      sessionId: "session-1",
      agentId: "main",
      turnId: 7,
      delta: "Shared update",
    });

    expect(sdk.subscriptionCount()).toBe(1);
    expect(sdk.handlerInstallations).toEqual({ approval: 1, question: 1 });
    expect(broadcasts.map((record) => record.webviewId)).toEqual(["view-1", "view-2"]);
  });

  it.each(["Write", "Edit"] as const)(
    "captures the original file when %s starts with a path",
    (name) => {
      const { sdk, baselines } = createRuntime();

      sdk.emit({
        type: "tool.call.started",
        sessionId: "session-1",
        agentId: "main",
        origin: "loop",
        turnId: 7,
        toolCallId: "tool-1",
        name,
        args: { path: "src/index.ts" },
      });

      expect(baselines).toEqual([
        {
          session: {
            id: "session-1",
            workDir: "/workspace",
            metadata: { source: "vscode-test" },
          },
          filePath: "src/index.ts",
          webviewIds: ["view-1"],
        },
      ]);
    },
  );

  it.each([
    ["Read", { path: "src/index.ts" }],
    ["Write", {}],
    ["Edit", { path: "" }],
  ] as const)("does not capture a baseline when %s receives non-write input %#", (name, args) => {
    const { sdk, baselines } = createRuntime();

    sdk.emit({
      type: "tool.call.started",
      sessionId: "session-1",
      agentId: "main",
      origin: "loop",
      turnId: 7,
      toolCallId: "tool-1",
      name,
      args,
    });

    expect(baselines).toEqual([]);
  });

  it("rejects a removed engine skill without listing or activating it", async () => {
    const listSkills = vi.fn();
    const runTurnAction = vi.fn();
    const runtime = {
      session: { listSkills, activateSkill: vi.fn() },
      runTurnAction,
    } as unknown as SessionRuntime;

    await expect(runHostSlashCommand(
      runtime,
      { name: "skill:sub-skill.review", args: "", raw: "/skill:sub-skill.review" },
      {} as HandlerContext,
    )).rejects.toThrow("Skill 'sub-skill.review' is not available in KIMI KRINIK.");
    expect(listSkills).not.toHaveBeenCalled();
    expect(runTurnAction).not.toHaveBeenCalled();
  });

  it("passes the visible variant path when the default skill is filtered out", async () => {
    const activateSkill = vi.fn<(name: string, args?: string, options?: { path?: string }) => Promise<void>>();
    const runtime = {
      session: {
        listSkills: vi.fn(async () => [
          { name: "review", type: "prompt", path: "/work/A/review/SKILL.md", scopes: ["web"] },
          { name: "review", type: "prompt", path: "/work/B/review/SKILL.md" },
        ]),
        activateSkill,
      },
      runTurnAction: vi.fn(async (_raw: string, action: () => Promise<void>) => {
        await action();
        return { status: "finished" };
      }),
    } as unknown as SessionRuntime;

    const done = await runHostSlashCommand(
      runtime,
      { name: "skill:review", args: "", raw: "/skill:review" },
      {} as HandlerContext,
    );

    expect(done).toBe(true);
    expect(activateSkill).toHaveBeenCalledWith("review", undefined, { path: "/work/B/review/SKILL.md" });
  });

  it("prefers the exact-case visible variant when activating a skill", async () => {
    const activateSkill = vi.fn<(name: string, args?: string, options?: { path?: string }) => Promise<void>>();
    const runtime = {
      session: {
        listSkills: vi.fn(async () => [
          { name: "Review", type: "prompt", path: "/work/A/review/SKILL.md" },
          { name: "review", type: "prompt", path: "/work/B/review/SKILL.md" },
        ]),
        activateSkill,
      },
      runTurnAction: vi.fn(async (_raw: string, action: () => Promise<void>) => {
        await action();
        return { status: "finished" };
      }),
    } as unknown as SessionRuntime;

    await runHostSlashCommand(
      runtime,
      { name: "skill:review", args: "", raw: "/skill:review" },
      {} as HandlerContext,
    );

    expect(activateSkill).toHaveBeenCalledWith("review", undefined, { path: "/work/B/review/SKILL.md" });
  });
});

describe("Context Window Control runtime delivery", () => {
  it("turns an SDK status into one self-contained steer without requiring a skill", async () => {
    const sdk = createFakeSession();
    const log = vi.fn();
    const runtime = new SessionRuntime({
      session: sdk.session,
      legacyApproval: DEFAULT_LEGACY_APPROVAL,
      broadcast: vi.fn(),
      captureBaseline: vi.fn(),
      log,
      contextWindowControl: async () => ({
        enabled: true,
        autoCompact: false,
        thresholds: { warnPct: 70, cutPct: 75, closePct: 80, forcePct: 90 },
      }),
    });

    sdk.emit({
      type: "agent.status.updated",
      sessionId: "session-1",
      agentId: "main",
      contextTokens: 623_903,
      maxContextTokens: 1_048_576,
    });

    await vi.waitFor(() => expect(sdk.steerInputs).toHaveLength(1));
    const line = sdk.steerInputs[0];
    expect(line).toBeTypeOf("string");
    expect(line).toContain("<system>KIMI KRINIK context:");
    expect(line).not.toContain("KAIF");
    expect(log).not.toHaveBeenCalled();
    await runtime.close();
  });

  it("retries Context Window Control after a blocked submission", async () => {
    const sdk = createFakeSession();
    const runtime = new SessionRuntime({
      session: sdk.session,
      legacyApproval: DEFAULT_LEGACY_APPROVAL,
      broadcast: vi.fn(),
      captureBaseline: vi.fn(),
      log: vi.fn(),
      contextWindowControl: async () => ({
        enabled: true,
        autoCompact: false,
        thresholds: { warnPct: 70, cutPct: 75, closePct: 80, forcePct: 90 },
      }),
    });
    sdk.setSteerResult({ promptId: "prompt-blocked", createdAt: "2026-11-24T00:00:00.000Z", state: "blocked", steered: false });
    const status = {
      type: "agent.status.updated",
      sessionId: "session-1",
      agentId: "main",
      contextTokens: 802_161,
      maxContextTokens: 1_048_576,
    } as const;

    sdk.emit(status);
    sdk.emit(status);
    await vi.waitFor(() => expect(sdk.steerInputs).toHaveLength(2));

    sdk.setSteerResult(RUNNING_STEER_RESULT);
    sdk.emit(status);
    await vi.waitFor(() => expect(sdk.steerInputs).toHaveLength(3));
    sdk.emit(status);
    await new Promise<void>((resolve) => { setImmediate(resolve); });
    expect(sdk.steerInputs).toHaveLength(3);
    await runtime.close();
  });
});
