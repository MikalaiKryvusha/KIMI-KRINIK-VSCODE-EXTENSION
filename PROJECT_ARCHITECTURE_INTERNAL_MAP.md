# KIMI KRINIK — Internal architecture map

> **The INTERNAL map: the project's logical architecture** — the abstractions and how they interact. Where
> `PROJECT_STRUCTURE_EXTERNAL_MAP.md` says *where things live*, this says *how the system thinks*.
> **Living reference — never DONE-tagged.**

---

## The objects

| Object | Essence | Lives in |
|---|---|---|
| **Extension host** | activates the extension, registers commands and the webview views, owns one `KimiHarness` | `apps/vscode/src/extension.ts`, `KimiWebviewProvider.ts` |
| **Bridge** | typed request/response RPC between webview and host plus host→webview events; every method has a `validateParams` branch | `apps/vscode/shared/bridge.ts`, `src/bridge-handler.ts`, `webview-ui/src/services/bridge.ts` |
| **Handlers** | one module per domain (chat, session, config, auth, attention, file, workspace, mcp) answering bridge methods | `apps/vscode/src/handlers/` |
| **Session runtime** | one live engine session per webview: prompt, steer, abort, approvals, questions | `apps/vscode/src/runtime/session-runtime.ts`, `reverse-rpc.ts` |
| **Event adapter** | maps SDK wire events to the webview's legacy `UIStreamEvent` stream | `apps/vscode/src/runtime/event-adapter.ts`, `shared/types.ts` |
| **Chat store** | webview state of one conversation: messages with optimistic `clientId`, streaming flag, draft media, `pendingInput` (retry), `composerRestore`, queue | `apps/vscode/webview-ui/src/stores/chat.store.ts`, `event-handlers.ts` |
| **Settings store** | models, current model and effort, login, extension config | `webview-ui/src/stores/settings.store.ts` |
| **Model picker** | combined model/effort quick selection, full search/provider filters, keyboard navigation and shared persisted favorites | `webview-ui/src/components/ModelPicker.tsx`, `ModelPickerDialog.tsx`, `inputarea/hooks/useFavoriteModels.ts` |
| **Status pills** | live queued/changes panels, background process/agent tasks, last Todo display and compaction viewer | `webview-ui/src/components/StatusPills.tsx` |
| **Engine** | the agent loop and compaction; `loopControl.autoCompact === false` refuses every automatic compaction | `packages/agent-core-v2/src/agent/fullCompaction/fullCompactionService.ts` |
| **Context Window Control** | independent per-session threshold decisions and serialized self-contained prompt delivery from SDK status; no KAIF marker or wire file required | `apps/vscode/src/runtime/context-window-control.ts`, wired by `kimi-runtime.ts` and `session-runtime.ts` |
| **KAIF contour** | optional hooks run by Kimi on its events: context-window closure, STATUS/test-debt Stop guards, voice before a permission wait | `.kaif/hooks/`, wired through `~/.kimi-code/config.toml` |

## The flows

1. **Prompt.** `InputArea` → `chat.store.sendMessage` → idle: `sendIdle` creates an optimistic user/assistant pair with a
   `clientId` → `bridge.streamChat` → `chat.handler` → `SessionRuntime` → SDK → engine. `TurnBegin` carries the same ID and
   reconciles the pair instead of duplicating it. Old events without an ID use content/order fallback.
2. **Follow-up during a turn.** `sendMessage` while `isStreaming` → optimistic `clientId` pair → `steerNow` → `bridge.steerChat`.
   The host returns the complete `PromptSubmissionResult`; runtime emits `SteerInput` only for an accepted running steer, maps a queued
   `promptId` to its later `TurnBegin`, and starts a non-steered running submission as its own correlated turn. `ok:false` reuses the same
   optimistic record through idempotent `sendIdle`; only the latest failed action restores its text/media. Queue lightning is store-owned,
   uses the queued ID as `clientId`, holds the remaining queue through the selected operation and restores the original index on failure.
   A genuine completion opens a batch window: the next idle prompt carries `drainQueue`, the host emits `QueueBatchReady` immediately after
   `session.prompt` accepts it, and every remaining item joins through sequential steering. Terminal `turnIndex` values suppress completions
   superseded by a newer visible turn. A failed batch item restores at its original index and stops later items.
   AUTO STEER OFF asks the host for activity so an already-idle queue advances without waiting for lightning.
3. **Attention.** `processEvent` → `notifyEventAttention` maps terminal errors, approvals, questions and completion to a `SoundEvent`;
   replay stays silent. `Voice` plays a packaged MP3 selected by event and interface language; Glass and tones use the same webview audio
   boundary. No host text-to-speech command or browser speech fallback participates.
4. **Managed quota.** `UsageStatusBar` polls `bridge.getManagedUsage` every 60 s for the `managed:kimi-code` provider →
   `auth.handler` → `harness.auth.getManagedUsage` → `shared/managed-usage.ts` view.
5. **Compaction.** The engine checks before and after each step and on context overflow; with `auto_compact = false` none of the
   three starts, manual `/compact` stays. A live flip to OFF also aborts the active automatic operation through the
   `loopControl` section subscription before its provider response, without cancelling an active manual compaction.
6. **Context Window Control.** `agent.status.updated` → `ContextWindowController` reads the current VS Code thresholds and engine
   loop config → one highest newly reached stage → `session.promptWithSkills(..., steerIfActive: true)`. A compaction re-arms the
   stages. With a valid KAIF marker, `contextWindow.owner = "kimi-krinik"` makes the KAIF context hook dormant; removing the owner
   hands the contour back. The KAIF hook is also dormant while stock Auto Compact is ON.
7. **Permission defaults.** `PermissionModeButton` → `modes.handler` changes the live session and persists `defaultPermissionMode`
   through `harness.setConfig`; a failed default write restores the previous live mode. App initialization reads the engine default
   with legacy `kimi.yoloMode` as fallback. Starting a new conversation clears the old session override; `bridge-handler` reads the
   current engine default and `KimiRuntime.openSession` applies it only to a new session. Resume keeps the existing approval metadata
   and legacy-YOLO compatibility path.
8. **Status and title.** `StatusPills` polls `runtime.session.listBackgroundTasks()` for process/agent rows, reads queue/file-change
   events, the last `SetTodoList` display and compaction state. `summary.title` and `session.meta.updated` flow through
   `StatusUpdate.session_title` into the chat store and header; starting/loading another conversation clears the old title first.

## Invariants

1. One authority per setting: the engine config owns `auto_compact`; the extension never keeps a second copy.
2. `pendingInput` belongs to the running turn (retry); composer restoration goes through `composerRestore` only.
3. Replayed history never triggers attention.
4. Only one contour delivers context-window stage prompts: built-in KIMI KRINIK ownership excludes the KAIF context hook.
5. An optimistic `clientId` identifies one user action through bridge, runtime and live events; durable `TurnBegin`/`SteerInput`
   reconcile that record instead of creating a second bubble, while legacy events without IDs remain supported.
