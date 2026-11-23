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
| **Chat store** | webview state of one conversation: messages, streaming flag, draft media, `pendingInput` (retry), `composerRestore`, queue | `apps/vscode/webview-ui/src/stores/chat.store.ts`, `event-handlers.ts` |
| **Settings store** | models, current model and effort, login, extension config | `webview-ui/src/stores/settings.store.ts` |
| **Engine** | the agent loop and compaction; `loopControl.autoCompact === false` refuses every automatic compaction | `packages/agent-core-v2/src/agent/fullCompaction/fullCompactionService.ts` |
| **KAIF contour** | hooks run by Kimi on its events: context-window closure, STATUS/test-debt Stop guards, voice before a permission wait | `.kaif/hooks/`, wired through `~/.kimi-code/config.toml` |

## The flows

1. **Prompt.** `InputArea` → `chat.store.sendMessage` → idle: `sendIdle` → `bridge.streamChat` → `chat.handler` →
   `SessionRuntime` → SDK → engine. Events come back as `Events.StreamEvent` and go through `processEvent`.
2. **Follow-up during a turn.** `sendMessage` while `isStreaming` → `steerNow` → `bridge.steerChat`. `ok:true` removes the sent
   media; `ok:false` (the turn already ended) sends the same content once through `sendIdle`; a rejection returns the text
   through `composerRestore` and the media to the draft. Media in flight carry `steering: true` and are never sent twice.
3. **Attention.** `processEvent` → `notifyEventAttention` (terminal errors, approvals, questions; silent during `loadSession`
   replay) → `bridge.notifyAttention` → `attention.handler` spawns the voice command; without one the webview speaks.
4. **Managed quota.** `UsageStatusBar` polls `bridge.getManagedUsage` every 60 s for the `managed:kimi-code` provider →
   `auth.handler` → `harness.auth.getManagedUsage` → `shared/managed-usage.ts` view.
5. **Compaction.** The engine checks before and after each step and on context overflow; with `auto_compact = false` none of the
   three starts, manual `/compact` stays. With KAIF the context-window hook closes the session by thresholds.

## Invariants

1. One authority per setting: the engine config owns `auto_compact`; the extension never keeps a second copy.
2. `pendingInput` belongs to the running turn (retry); composer restoration goes through `composerRestore` only.
3. Replayed history never triggers attention.
