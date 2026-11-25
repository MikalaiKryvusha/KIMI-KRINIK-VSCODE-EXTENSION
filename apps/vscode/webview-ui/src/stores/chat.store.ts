import { v4 as randomUUID } from "uuid";
import { create } from "zustand";
import { produce } from "immer";
import { bridge } from "@/services";
import { Content } from "@/lib/content";
import { useApprovalStore } from "./approval.store";
import { toast } from "@/components/ui/sonner";
import { notifyAttention } from "@/lib/attention";
import { t } from "@/i18n";

import { useSettingsStore } from "./settings.store";
import { processEvent } from "./event-handlers";
import type { RunResult, StatusUpdate, ContentPart, QuestionRequest, ToolResult } from "shared/legacy-sdk";
import type { StreamError, UIStreamEvent } from "shared/types";
import type { GoalStateInfo, PermissionModeName } from "shared/modes";

const HANDSHAKE_TIMEOUT_MS = 30_000;
const ACTIVE_WORK_EVENT_TYPES = new Set(["StepBegin", "ContentPart", "ToolCall", "ToolCallPart", "ToolResult"]);

export interface UIToolCall {
  id: string;
  name: string;
  arguments: string | null;
}

export interface UIStep {
  n: number;
  items: UIStepItem[];
  planMode?: boolean;
}

export interface InlineError {
  code: string;
  message: string;
  detail?: string;
}

export type UIStepItem =
  | { type: "thinking"; content: string; finished?: boolean }
  | { type: "text"; content: string; finished?: boolean }
  | { type: "compaction" }
  | { type: "steer"; content: string | ContentPart[] }
  | {
      type: "tool_use";
      id: string;
      call: UIToolCall;
      result?: ToolResult["return_value"];
      subagent_steps?: UIStep[];
    };

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string | ContentPart[];
  timestamp: number;
  steps?: UIStep[];
  status?: StatusUpdate;
  inlineError?: InlineError;
  turnIndex?: number;
  forkable?: boolean;
  clientId?: string;
  optimistic?: boolean;
  deferPresentation?: boolean;
}

export interface TokenUsage {
  input_other: number;
  output: number;
  input_cache_read: number;
  input_cache_creation: number;
}

function createEmptyTokenUsage(): TokenUsage {
  return { input_other: 0, output: 0, input_cache_read: 0, input_cache_creation: 0 };
}

export interface MediaInConversation {
  hasImage: boolean;
  hasVideo: boolean;
}

export interface DraftMediaItem {
  id: string;
  dataUri?: string;
}

export interface PendingInput {
  content: string | ContentPart[];
  model: string;
  clientId?: string;
  drainQueue?: boolean;
}

export interface QueuedItem {
  id: string;
  content: string | ContentPart[];
  model: string;
}

export interface ChatState {
  sessionId: string | null;
  sessionTitle: string | null;
  messages: ChatMessage[];
  isStreaming: boolean;
  isCompacting: boolean;
  handshakeReceived: boolean;
  draftMedia: DraftMediaItem[];
  lastStatus: StatusUpdate | null;
  tokenUsage: TokenUsage;
  activeTokenUsage: TokenUsage;
  pendingInput: PendingInput | null;
  composerRestore: string | null;
  queue: QueuedItem[];
  queueSteerInFlight: string | null;
  pendingQuestion: QuestionRequest | null;
  planMode: boolean;
  swarmMode: boolean;
  permissionMode: PermissionModeName | null;
  goal: GoalStateInfo | null;
  goalArmed: boolean;

  sendMessage: (text: string) => void;
  steerNow: (text: string) => void;
  retryLastMessage: () => void;
  processEvent: (event: UIStreamEvent) => void;
  loadSession: (sessionId: string, events: UIStreamEvent[]) => Promise<void>;
  startNewConversation: () => Promise<void>;
  abort: () => void;
  addDraftMedia: (id: string, dataUri?: string) => void;
  updateDraftMedia: (id: string, dataUri: string) => void;
  removeDraftMedia: (id: string) => void;
  clearDraftMedia: () => void;
  getMediaInConversation: () => MediaInConversation;
  hasProcessingMedia: () => boolean;
  rollbackInput: (content: string | ContentPart[]) => void;
  respondQuestion: (answers: Record<string, string>) => Promise<void>;

  enqueue: (content: string | ContentPart[], model: string) => void;
  steerQueueItem: (id: string) => void;
  removeFromQueue: (id: string) => void;
  editQueueItem: (id: string, content: string | ContentPart[]) => void;
  moveQueueItemUp: (id: string) => void;
  sendNextQueued: () => void;
}

let handshakeTimer: ReturnType<typeof setTimeout> | null = null;
let latestOutboundClientId: string | undefined;

function notifyEventAttention(event: UIStreamEvent): void {
  const { sounds } = useSettingsStore.getState().extensionConfig;
  if (event.type === "error") {
    const error = event as StreamError;
    if (error.terminal === false) return;
    notifyAttention("error", sounds.error);
  } else if (event.type === "ApprovalRequest") {
    notifyAttention("approval", sounds.approval);
  } else if (event.type === "QuestionRequest") {
    notifyAttention("question", sounds.question);
  } else if (event.type === "stream_complete" && (event as { result: RunResult }).result.status === "finished") {
    notifyAttention("turnComplete", sounds.turnComplete);
  }
}

function sendableDraftMedia(draftMedia: readonly DraftMediaItem[]): DraftMediaItem[] {
  return draftMedia.filter((item) => item.dataUri);
}

function buildDraftContent(text: string, media: readonly DraftMediaItem[]): string | ContentPart[] {
  const dataUris = media.map((item) => item.dataUri!);
  return dataUris.length > 0 ? Content.build(text, dataUris) : text;
}

function restoreSentDraftMedia(current: readonly DraftMediaItem[], sent: readonly DraftMediaItem[]): DraftMediaItem[] {
  const sentIds = new Set(sent.map((item) => item.id));
  return [...sent, ...current.filter((item) => !sentIds.has(item.id))];
}

function appendOptimisticTurn(clientId: string, content: string | ContentPart[], deferPresentation = false): void {
  latestOutboundClientId = clientId;
  useChatStore.setState(
    produce((draft: ChatState) => {
      const existingAssistant = draft.messages.find((message) => message.role === "assistant" && message.clientId === clientId);
      if (existingAssistant) existingAssistant.deferPresentation = deferPresentation;
      if (draft.messages.some((message) => message.clientId === clientId)) return;
      const timestamp = Date.now();
      draft.messages.push({ id: clientId, role: "user", content, timestamp, clientId, optimistic: true });
      draft.messages.push({ id: randomUUID(), role: "assistant", content: "", timestamp, steps: [], clientId, optimistic: true, deferPresentation });
    }),
  );
}

function discardOptimisticTurn(clientId: string): void {
  useChatStore.setState((state) => ({ messages: state.messages.filter((message) => message.clientId !== clientId) }));
}

function clearHandshakeTimer() {
  if (handshakeTimer) {
    clearTimeout(handshakeTimer);
    handshakeTimer = null;
  }
}

function clearAllInlineErrors(draft: ChatState): void {
  for (const msg of draft.messages) {
    if (msg.inlineError) {
      msg.inlineError = undefined;
    }
  }
}

function doSend(state: ChatState, content: string | ContentPart[], model: string, goalObjective: string | undefined, clientId: string) {
  const { sessionId, planMode } = state;
  const { thinkingEffort } = useSettingsStore.getState();

  clearHandshakeTimer();
  handshakeTimer = setTimeout(() => {
    const s = useChatStore.getState();
    if (s.isStreaming && !s.handshakeReceived) {
      void bridge.abortChat().catch(() => undefined);
      s.processEvent({
        type: "error",
        code: "HANDSHAKE_TIMEOUT",
        message: t("chat.connectionTimedOut"),
        phase: "runtime",
      });
    }
  }, HANDSHAKE_TIMEOUT_MS);

  void bridge
    .streamChat(content, model, thinkingEffort, planMode, sessionId ?? undefined, {
      ...(state.permissionMode === null ? {} : { permissionMode: state.permissionMode }),
      ...(goalObjective === undefined ? {} : { goalObjective }),
      ...(state.pendingInput?.drainQueue === true && state.pendingInput.clientId === clientId ? { drainQueue: true } : {}),
      clientId,
    })
    .catch((error: unknown) => {
      const detail = error instanceof Error ? error.message : String(error);
      useChatStore.getState().processEvent({
        type: "error",
        code: "internal",
        message: t("chat.unableToSend"),
        detail,
        phase: "preflight",
      });
    });
}

function drainNextQueuedItem(): void {
  const next = useChatStore.getState().queue[0];
  if (next !== undefined) useChatStore.getState().steerQueueItem(next.id);
}

function sendIdle(content: string | ContentPart[], model: string, sentMediaIds?: ReadonlySet<string>, goalObjective?: string, existingClientId?: string) {
  const clientId = existingClientId ?? randomUUID();
  useChatStore.setState(
    produce((draft: ChatState) => {
      clearAllInlineErrors(draft);
      draft.draftMedia = sentMediaIds === undefined
        ? []
        : draft.draftMedia.filter((item) => !sentMediaIds.has(item.id));
      draft.isStreaming = true;
      draft.handshakeReceived = false;
      draft.pendingInput = { content, model, clientId };
    }),
  );
  appendOptimisticTurn(clientId, content);
  useApprovalStore.getState().clearRequests();
  doSend(useChatStore.getState(), content, model, goalObjective, clientId);
}

export const useChatStore = create<ChatState>((set, get) => ({
  sessionId: null,
  sessionTitle: null,
  messages: [],
  isStreaming: false,
  isCompacting: false,
  handshakeReceived: false,
  draftMedia: [],
  lastStatus: null,
  tokenUsage: createEmptyTokenUsage(),
  activeTokenUsage: createEmptyTokenUsage(),
  pendingInput: null,
  composerRestore: null,
  queue: [],
  queueSteerInFlight: null,
  pendingQuestion: null,
  planMode: false,
  swarmMode: false,
  permissionMode: null,
  goal: null,
  goalArmed: false,

  sendMessage: (text) => {
    if (get().isStreaming) {
      if (useSettingsStore.getState().extensionConfig.autoSteer) {
        get().steerNow(text);
        return;
      }
      const media = sendableDraftMedia(get().draftMedia);
      const content = buildDraftContent(text, media);
      if (Content.isEmpty(content)) return;
      const queuedMediaIds = new Set(media.map((item) => item.id));
      get().enqueue(content, useSettingsStore.getState().currentModel);
      set((state) => ({ draftMedia: state.draftMedia.filter((item) => !queuedMediaIds.has(item.id)) }));
      setTimeout(() => get().sendNextQueued(), 0);
      return;
    }
    const { currentModel } = useSettingsStore.getState();
    const content = buildDraftContent(text, sendableDraftMedia(get().draftMedia));
    if (Content.isEmpty(content)) return;
    const goalObjective = get().goalArmed && text.trim() ? text.trim() : undefined;
    if (goalObjective !== undefined) set({ goalArmed: false });
    sendIdle(content, currentModel, undefined, goalObjective);
  },

  steerNow: (text) => {
    if (!get().isStreaming) {
      get().sendMessage(text);
      return;
    }
    const { currentModel } = useSettingsStore.getState();
    const media = sendableDraftMedia(get().draftMedia);
    const content = buildDraftContent(text, media);
    if (Content.isEmpty(content)) return;
    const sentMediaIds = new Set(media.map((item) => item.id));
    const clientId = randomUUID();
    set((state) => ({
      draftMedia: state.draftMedia.filter((item) => !sentMediaIds.has(item.id)),
    }));
    appendOptimisticTurn(clientId, content, true);

    void bridge.steerChat(content, clientId)
      .then((response) => {
        if (!response.ok) {
          sendIdle(content, currentModel, sentMediaIds, undefined, clientId);
          return;
        }
        if (response.submission.state === "blocked") {
          discardOptimisticTurn(clientId);
          if (latestOutboundClientId === clientId) {
            set((state) => ({
              draftMedia: restoreSentDraftMedia(state.draftMedia, media),
            }));
            get().rollbackInput(content);
          }
          toast.error(t("chat.unableToSend"));
          return;
        }
        set((state) => ({
          isStreaming: true,
          draftMedia: state.draftMedia.filter((item) => !sentMediaIds.has(item.id)),
        }));
      })
      .catch((error: unknown) => {
        discardOptimisticTurn(clientId);
        if (latestOutboundClientId === clientId) {
          set((state) => ({
            draftMedia: restoreSentDraftMedia(state.draftMedia, media),
          }));
          get().rollbackInput(content);
        }
        toast.error(error instanceof Error ? error.message : String(error));
      });
  },

  retryLastMessage: () => {
    const { pendingInput, isStreaming } = get();

    if (isStreaming || !pendingInput) {
      return;
    }

    set(
      produce((draft: ChatState) => {
        clearAllInlineErrors(draft);
        draft.isStreaming = true;
        draft.handshakeReceived = false;
        const lastAssistant = draft.messages.at(-1);
        if (lastAssistant?.role === "assistant" && lastAssistant.inlineError) {
          draft.messages.pop();
          if (draft.messages.at(-1)?.role === "user") {
            draft.messages.pop();
          }
        }
      }),
    );
    useApprovalStore.getState().clearRequests();

    const clientId = pendingInput.clientId ?? randomUUID();
    appendOptimisticTurn(clientId, pendingInput.content);
    doSend(get(), pendingInput.content, pendingInput.model, undefined, clientId);
  },

  processEvent: (event) => {
    if (event.type === "stream_complete" && "turnIndex" in event && event.turnIndex !== undefined) {
      const latestTurnIndex = get().messages.reduce(
        (latest, message) => Math.max(latest, message.turnIndex ?? -1),
        -1,
      );
      if (event.turnIndex < latestTurnIndex) return;
    }
    const completesQueueSteer = event.type === "stream_complete" && get().queueSteerInFlight !== null;
    notifyEventAttention(event);
    if (event.type === "error" && "terminal" in event && event.terminal === false) {
      clearHandshakeTimer();
      toast.warning(event.message);
      return;
    }
    if (event.type === "TurnBegin" || event.type === "StepBegin" || event.type === "ContentPart") {
      clearHandshakeTimer();
      set({ handshakeReceived: true });
    } else if (event.type === "stream_complete" || event.type === "error") {
      clearHandshakeTimer();
    }

    if (ACTIVE_WORK_EVENT_TYPES.has(event.type)) set({ isStreaming: true });

    set(
      produce((draft: ChatState) => {
        processEvent(draft, event);
      }),
    );
    if (completesQueueSteer) set({ queueSteerInFlight: null });
    if (event.type === "QueueBatchReady" && get().pendingInput?.drainQueue === true
      && (event.payload as { clientId?: string }).clientId === get().pendingInput?.clientId) {
      drainNextQueuedItem();
    }

    if (event.type === "stream_complete" || event.type === "error") {
      const { queue, isStreaming: stillStreaming } = get();
      if (!stillStreaming && queue.length > 0) {
        setTimeout(() => get().sendNextQueued(), 50);
      }
    }
  },

  loadSession: async (sessionId, events) => {
    clearHandshakeTimer();

    const { isStreaming: wasStreaming } = get();
    if (wasStreaming) {
      await bridge.abortChat();
    }

    useApprovalStore.getState().clearRequests();
    set(
      produce((draft: ChatState) => {
        draft.sessionId = sessionId;
        draft.sessionTitle = null;
        draft.messages = [];
        draft.isStreaming = false;
        draft.isCompacting = false;
        draft.handshakeReceived = false;
        draft.draftMedia = [];
        draft.lastStatus = null;
        draft.tokenUsage = createEmptyTokenUsage();
        draft.activeTokenUsage = createEmptyTokenUsage();
        draft.pendingInput = null;
        draft.composerRestore = null;
        draft.queue = [];
        draft.queueSteerInFlight = null;
        draft.pendingQuestion = null;
        draft.planMode = false;
        draft.swarmMode = false;
        draft.goal = null;
        draft.goalArmed = false;

        for (const event of events) processEvent(draft, event);

        for (const msg of draft.messages) {
          if (msg.steps) {
            for (const step of msg.steps) {
              for (const item of step.items) {
                if (item.type === "text" || item.type === "thinking") {
                  item.finished = true;
                }
              }
            }
          }
        }
        draft.isStreaming = false;
        draft.isCompacting = false;
        draft.pendingQuestion = null;
      }),
    );
    useApprovalStore.getState().clearRequests();
  },

  startNewConversation: async () => {
    clearHandshakeTimer();

    const { isStreaming: wasStreaming } = get();
    if (wasStreaming) {
      await bridge.abortChat();
    }

    await bridge.resetSession();
    await bridge.clearTrackedFiles();
    set({
      sessionId: null,
  sessionTitle: null,
      messages: [],
      isStreaming: false,
      isCompacting: false,
      handshakeReceived: false,
      draftMedia: [],
      lastStatus: null,
      tokenUsage: createEmptyTokenUsage(),
      activeTokenUsage: createEmptyTokenUsage(),
      pendingInput: null,
      composerRestore: null,
      queue: [],
      queueSteerInFlight: null,
      pendingQuestion: null,
      planMode: false,
      swarmMode: false,
      permissionMode: null,
      goal: null,
      goalArmed: false,
    });
    useApprovalStore.getState().clearRequests();
  },

  abort: () => {
    clearHandshakeTimer();
    void bridge.abortChat().catch(() => undefined);
    set({ pendingQuestion: null });
    useApprovalStore.getState().clearRequests();
  },

  addDraftMedia: (id, dataUri) => {
    set((s) => ({ draftMedia: [...s.draftMedia, { id, dataUri }] }));
  },

  updateDraftMedia: (id, dataUri) => {
    set((s) => ({
      draftMedia: s.draftMedia.map((m) => (m.id === id ? { ...m, dataUri } : m)),
    }));
  },

  removeDraftMedia: (id) => {
    set((s) => ({ draftMedia: s.draftMedia.filter((m) => m.id !== id) }));
  },

  clearDraftMedia: () => {
    set({ draftMedia: [] });
  },

  getMediaInConversation: () => {
    const { messages, draftMedia } = get();

    let hasImage = false;
    let hasVideo = false;

    for (const item of draftMedia) {
      if (!item.dataUri) {
        continue;
      }
      if (item.dataUri.startsWith("data:image/")) {
        hasImage = true;
      } else if (item.dataUri.startsWith("data:video/")) {
        hasVideo = true;
      }
    }

    for (const msg of messages) {
      if (Content.hasImages(msg.content)) {
        hasImage = true;
      }
      if (Content.hasVideos(msg.content)) {
        hasVideo = true;
      }
      if (hasImage && hasVideo) {
        break;
      }
    }

    return { hasImage, hasVideo };
  },

  hasProcessingMedia: () => {
    return get().draftMedia.some((m) => !m.dataUri);
  },

  rollbackInput: (content) => {
    set({ composerRestore: Content.getText(content) });
  },

  respondQuestion: async (answers) => {
    const { pendingQuestion } = get();
    if (!pendingQuestion) return;
    await bridge.respondQuestion(pendingQuestion.id, pendingQuestion.id, answers);
    set({ pendingQuestion: null });
  },

  enqueue: (content, model) => {
    set((s) => ({
      queue: [...s.queue, { id: randomUUID(), content, model }],
    }));
  },

  steerQueueItem: (id) => {
    const { queue, queueSteerInFlight } = get();
    if (queueSteerInFlight !== null) return;
    const index = queue.findIndex((item) => item.id === id);
    const item = queue[index];
    if (item === undefined) return;

    set({ queueSteerInFlight: id });
    get().removeFromQueue(id);
    appendOptimisticTurn(id, item.content);
    const restore = () => {
      set((state) => ({
        queue: state.queue.some((queued) => queued.id === id)
          ? state.queue
          : [...state.queue.slice(0, index), item, ...state.queue.slice(index)],
      }));
    };

    void bridge.steerChat(item.content, id).then((response) => {
      if (!response.ok || response.submission.state === "blocked") {
        discardOptimisticTurn(id);
        restore();
        set({ queueSteerInFlight: null });
        if (response.ok) toast.error(t("chat.unableToSend"));
        return;
      }
      const draining = get().pendingInput?.drainQueue === true;
      if (response.submission.state === "queued" && !draining) {
        discardOptimisticTurn(id);
        restore();
        set({ isStreaming: true });
        return;
      }
      set({ isStreaming: true, ...(draining ? { queueSteerInFlight: null } : {}) });
      if (draining) drainNextQueuedItem();
    }).catch((error: unknown) => {
      discardOptimisticTurn(id);
      restore();
      set({ queueSteerInFlight: null });
      toast.error(error instanceof Error ? error.message : String(error));
    });
  },

  removeFromQueue: (id) => {
    set((s) => ({ queue: s.queue.filter((q) => q.id !== id) }));
  },

  editQueueItem: (id, content) => {
    set((s) => ({
      queue: s.queue.map((q) => (q.id === id ? { ...q, content } : q)),
    }));
  },

  moveQueueItemUp: (id) => {
    set((s) => {
      const idx = s.queue.findIndex((q) => q.id === id);
      if (idx <= 0) {
        return s;
      }
      const next = [...s.queue];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return { queue: next };
    });
  },

  sendNextQueued: () => {
    const { queue, isStreaming, queueSteerInFlight } = get();
    if (queueSteerInFlight !== null || queue.length === 0) return;
    if (isStreaming) {
      void bridge.getSessionBusy().then(({ busy }) => {
        if (busy) return;
        set({ isStreaming: false });
        get().sendNextQueued();
      }).catch(() => undefined);
      return;
    }

    const [next, ...rest] = queue;
    const clientId = randomUUID();

    set(
      produce((draft: ChatState) => {
        clearAllInlineErrors(draft);
        draft.queue = rest;
        draft.isStreaming = true;
        draft.handshakeReceived = false;
        draft.pendingInput = { content: next.content, model: next.model, clientId, drainQueue: true };
        draft.draftMedia = [];
      }),
    );
    appendOptimisticTurn(clientId, next.content);
    useApprovalStore.getState().clearRequests();

    doSend(get(), next.content, next.model, undefined, clientId);
  },
}));
