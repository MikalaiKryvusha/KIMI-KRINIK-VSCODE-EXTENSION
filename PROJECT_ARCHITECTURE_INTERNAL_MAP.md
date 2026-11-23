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
| **Context Window Control** | independent per-session threshold decisions and serialized self-contained prompt delivery from SDK status; no KAIF marker or wire file required | `apps/vscode/src/runtime/context-window-control.ts`, wired by `kimi-runtime.ts` and `session-runtime.ts` |
| **KAIF contour** | optional hooks run by Kimi on its events: context-window closure, STATUS/test-debt Stop guards, voice before a permission wait | `.kaif/hooks/`, wired through `~/.kimi-code/config.toml` |

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
   three starts, manual `/compact` stays.
6. **Context Window Control.** `agent.status.updated` → `ContextWindowController` reads the current VS Code thresholds and engine
   loop config → one highest newly reached stage → `session.promptWithSkills(..., steerIfActive: true)`. A compaction re-arms the
   stages. With a valid KAIF marker, `contextWindow.owner = "kimi-krinik"` makes the KAIF context hook dormant; removing the owner
   hands the contour back. The KAIF hook is also dormant while stock Auto Compact is ON.
7. **Permission defaults.** `PermissionModeButton` → `modes.handler` changes the live session and persists `defaultPermissionMode`
   through `harness.setConfig`; a failed default write restores the previous live mode. App initialization reads the engine default
   with legacy `kimi.yoloMode` as fallback. Starting a new conversation clears the old session override; `bridge-handler` reads the
   current engine default and `KimiRuntime.openSession` applies it only to a new session. Resume keeps the existing approval metadata
   and legacy-YOLO compatibility path.

## Invariants

1. One authority per setting: the engine config owns `auto_compact`; the extension never keeps a second copy.
2. `pendingInput` belongs to the running turn (retry); composer restoration goes through `composerRestore` only.
3. Replayed history never triggers attention.
4. Only one contour delivers context-window stage prompts: built-in KIMI KRINIK ownership excludes the KAIF context hook.
