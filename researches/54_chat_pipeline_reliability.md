# Research 54 — Reliable outbound chat pipeline

> **Created:** 2026-11-24
> **Parent:** `bugs/11`–`bugs/16`; owner's request to research Claude Code and redesign the whole KIMI KRINIK chat flow
> **Status:** evidence complete; implementation not started
> **Outbound:** `plans/01_EPIC_chat_pipeline_reliability.md`; phase 0 operational plan `plans/02_epic01_characterize_chat_pipeline.md`
> **Verification:** [TESTED: 2026-11-24 · official URLs, installed Claude bundle and local source quotes checked; requirements/attribution lint and fable-judge VERIFIED WITH CAVEATS — scenario-lint SKIPPED, no implementation or functional run claimed]

## 1. Requirements and constraints

The owner requires the whole under-the-hood flow to be fixed, not only its renderer:

> «Чинить нужно всю цепочку отправки, а не отдельный рендер … Гугли, как устроен харнес Claude Code в их чате … Пиши конспект и планы починки и переделки нашего флоу конвеера чата.»

Observed requirements from `bugs/11`–`bugs/16` and the live review:

- a sent message appears synchronously in the conversation before engine acknowledgement;
- steering with text or attachments is delivered exactly once at running, queued and turn-boundary states;
- AUTO STEER OFF immediately shows the same message in a visible queue and dequeues it exactly once;
- an obsolete asynchronous completion cannot restore an older composer draft;
- attachments render thumbnails and open in the viewer;
- the user's steering bubble precedes the assistant avatar and response section;
- internal hook output never renders as assistant text;
- replay preserves identity, order, media and visibility without duplicates;
- development continues inside KIMI KRINIK, with fixes run and observed in isolated VS Code;
- the official Kimi engine remains the engine. `MASTER_PLAN.md` requires surgical changes and forbids wholesale copying of `InputArea` or stores.

## 2. Industry evidence

### 2.1 Claude Code's documented contract

[Claude's VS Code documentation](https://code.claude.com/docs/en/vs-code) says the extension bundles its own CLI and provides native graphical conversations. The interface and terminal therefore share the agent loop rather than implementing different engines.

[How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works) defines the harness as the layer around the model that supplies tools and manages context. Its steering contract says:

> «The message shows as queued in the conversation. If Claude is running tool calls, it reads the message as soon as those calls finish, within the same turn, and adjusts before its next step.»

[Interactive mode](https://code.claude.com/docs/en/interactive-mode) adds these observable rules:

- queued entries are listed in the conversation until sent;
- sent and queued messages remain gray until Claude starts responding;
- a queued IDE selection is the selection captured at Enter, not a later selection;
- Ctrl+Enter can flush queued messages;
- Up returns queued content to the composer.

The same documentation says sessions persist as plaintext JSONL under `~/.claude/projects/`. UI optimism is not the durable authority: the engine transcript is.

### 2.2 Claude Code's actual bundled host and webview

The installed official package `~/.vscode/extensions/anthropic.claude-code-2.1.331-win32-x64/` was inspected directly. The public `anthropics/claude-code` repository does not contain this webview source, so the bundled artifact is the implementation evidence; documentation alone is not treated as proof of implementation.

The webview creates a user UUID before transport:

```js
let b=crypto.randomUUID(), ... y={type:"user",uuid:b,...message:{role:"user",content:m}}
```

While a turn is running or queued, it stores a local held entry. Otherwise it inserts the user message into `messages.value` before `sendInput`:

```js
if(x&&this.turnRunningOrQueued)
  this.heldPrompts.value=[...this.heldPrompts.value,{uuid:b,message:x,...}]
else if(x) { ... this.messages.value=I.messages ... }
...
R.sendInput(S,y,!1,P)
...
this.unacknowledgedSendUuids.add(b)
```

`releaseHeldPrompts` moves picked-up entries into the transcript, and `appendPickedUp` checks UUIDs before appending, preventing an optimistic/durable duplicate.

The host independently tracks transport acceptance. `transportMessage` pushes the UUID into `outstandingSendUuids`; a result carrying `user_message_uuid` removes the acknowledged prefix. `turnComplete` and `atRest` are computed with outstanding sends, queued commands and background work, so a stream result alone cannot falsely make the channel idle.

The webview also has a failure surface for an unacknowledged clean stream end:

```text
The connection to Claude Code ended before this message completed — it may not have been processed, so please send it again.
```

`noteSendAcknowledgements` clears IDs on `command_lifecycle` or `result.user_message_uuid(s)`. This distinguishes local display, transport acceptance and final settlement instead of treating one RPC completion as all three.

### 2.3 Mature optimistic-update practice

[Ably's optimistic updates guide](https://ably.com/docs/ai-transport/features/optimistic-updates) describes insertion before POST and generation of a client-side `codec-message-id`. The echo is reconciled by that correlation ID; the durable domain message keeps its own separate ID. The conversation tree is held by a durable session.

The relevant design rule is two identities with a mapping, not one hoped-for global ID:

```text
local correlation ID → durable engine ID
```

[The Agent SDK TypeScript reference](https://code.claude.com/docs/en/agent-sdk/typescript) makes retry safety equally explicit in its `still_queued` receipt contract: a listed message that is not cancelled enters the conversation whether or not it receives a response, so resending it delivers it twice. Unknown delivery must not be blindly retried.

### 2.4 Anti-pattern: dequeue is not durable delivery

[Claude Code issue #82772](https://github.com/anthropics/claude-code/issues/82772) documents `queue-operation: dequeue` followed by no `user` transcript entry and no inference request. The issue author's local dataset reports repeated occurrences; that is not treated as an Anthropic-verified rate.

Healthy evidence in the report is:

```text
enqueue → dequeue → user
```

The failure is:

```text
enqueue → dequeue → EOF
```

The lesson for this epic is that a queue counter or dequeue event cannot prove durable acceptance. The UI needs the engine's resulting prompt state and durable prompt identity, plus an explicit uncertain/failed outcome when that evidence never arrives.

## 3. Prior art inside this monorepo

`packages/app-client/src/client/usePromptPipeline.ts` already implements the same class of reliability without Claude's UI:

- `newPromptId()` and an optimistic user message precede submission;
- metadata includes `kimiWeb.promptId` and `kimiWeb.steerPhase: sending | accepted`;
- `chainSteer` serializes steering per session;
- `submitWithNetworkRetry` is bounded by an explicit outcome rather than an unconditional echo;
- failure removes only the corresponding optimistic bubble;
- queue entries are restored on rejection, and `steerQueued` restores the original index;
- an idle steer falls back to normal submission, while queue/compact barriers and in-flight steering prevent premature flushing.

`packages/app-client/src/stores/prompt.ts` keeps separate collections for queued, in-flight and optimistic entries and exposes `addOptimisticMessage`, `patchOptimisticMessage`, `removeOptimisticMessage`, `restoreQueueEntry` and `isCurrentSteerChain`.

The existing `packages/app-client/test/workspace-state.test.ts` cases cover rejected/network-failed optimistic rollback, queue restoration at the original index, queued steering and idle fallback. These are contract scenarios to reuse, not components to copy wholesale.

## 4. Current KIMI KRINIK flow and gaps

### 4.1 SDK and engine already provide correlation and outcome data

- `packages/node-sdk/src/types.ts:291-297` defines `PromptSubmissionResult` with `promptId`, `createdAt`, `state: running | queued | blocked`, optional `turnId` and `steered`.
- `packages/node-sdk/src/session.ts:170-179` accepts an optional `promptId` for ordinary `prompt()` calls.
- `packages/agent-core-v2/src/agent/loop/loopService.ts:978-1004` returns `queued` without launching, `blocked` when launch is rejected, or `running` with `steered` after readiness.
- `packages/agent-core-v2/src/agent/loop/turnEvents.ts:35-42` carries optional `promptId` in `turn.started`.
- `packages/core/src/llm/message.ts:171-179` persists `promptId`, `createdAt` and `userMessageId` in user-message attributes.
- `packages/node-sdk/src/v2/event-mapper.ts:53-63` drops `prompt.submitted` and `prompt.steered` from the v1 event stream, so the extension cannot rely on those events without a separate SDK contract change.

### 4.2 Current outbound and render path

| Stage | Current code | Evidence and failure exposed |
|---|---|---|
| Composer | `InputArea.tsx:205-213` clears the editor immediately after `sendMessage` | there is no durable outbound record behind the cleared draft |
| Idle send | `chat.store.ts:220-234` sets one `pendingInput`; `doSend` calls `streamChat` | one slot cannot correlate concurrent outbound records |
| AUTO STEER ON | `chat.store.ts:279-312` calls `bridge.steerChat` without an optimistic bubble | the user waits for acknowledgement to see anything |
| Host | `chat.handler.ts:176-181` checks `runtime.isBusy`, awaits `runtime.steer`, then returns only `ok` | rich engine result is lost |
| Runtime | `session-runtime.ts:372-379` awaits `session.steer` and always emits `SteerInput` | queued and blocked results can look successful; result `promptId/state/steered` is ignored |
| Media | `chat.store.ts:284-301` marks media steering and removes it on `{ok:true}` | an imprecise acknowledgement can discard the only ready draft copy |
| Failure | `chat.store.ts:303-310` restores any rejected steer through `rollbackInput` | an older rejection can restore old text after a newer send |
| AUTO STEER OFF | `chat.store.ts:257-269` enqueues only while `isStreaming`; `stream_complete` schedules `sendNextQueued` | state transition and visible queue delivery need proof |
| Live turn | `event-adapter.ts:102-116` creates `TurnBegin` from one `pendingInput` and drops SDK `promptId` | queued/steered records cannot be reconciled by identity |
| Assistant timeline | `event-handlers.ts:562-570` nests `SteerInput` inside assistant steps | avatar precedes the later user bubble (`bugs/16`) |
| Media timeline | `ChatMessage.tsx:31-39` renders steer text only | no thumbnail/viewer path (`bugs/13`) |
| Replay | `replay-adapter.ts:90-137` creates turns without prompt IDs and emits hook parts as `ContentPart` | identity is unavailable and internal instructions become visible (`bugs/15`) |

### 4.3 Tests that currently give false confidence

- store tests assert mocked `{ok:true}` and media clearing, not real `PromptSubmissionResult.state`;
- the successful runtime test at `session-runtime.test.ts:568-579` requires unconditional `SteerInput`, so it cannot catch queued/blocked misrepresentation;
- earlier C09/C10 isolated cases were text-only and did not exercise the owner's real hook, media and race conditions;
- `replay-adapter.test.ts:385-435` currently expects internal hook text to be visible, contradicting the owner's explicit requirement;
- no test proves a bubble before a deferred steer acknowledgement or stale-response isolation across multiple sends.

## 5. Findings → implications for this epic

1. **Make result truth precede visual success.** Return `PromptSubmissionResult` through runtime and host. `running`, `queued` and `blocked` must produce different UI states; only a real result can remove media or mark acceptance.
2. **Create one outbound record at Send.** It holds local `clientId`, optional engine `promptId`, full content, model, requested mode and lifecycle. `pendingInput`, queue rows and optimistic bubbles are projections of that record, not independent authorities.
3. **Use two-ID reconciliation.** The local ID correlates immediate UI with the RPC result; the returned engine ID correlates subsequent `turn.started` and replay. Do not change the public SDK for this initially.
4. **Bound every completion by identity.** A late response updates only its own outbound record. It cannot restore a composer, remove newer media or change another message's state.
5. **Make fallback an exactly-once continuation.** If the host finds the turn idle, ordinary `prompt()` continues the same record using its engine prompt ID when available; it never creates an unrelated second message.
6. **Keep queued state visible.** `state: queued` produces a queue projection immediately. `turn.started.promptId` promotes that same record into the running timeline.
7. **Represent steering as a user timeline entry.** It is not an assistant step. This fixes avatar order and lets the existing `MessageMedia`/`MediaPreviewModal` path serve steering bubbles.
8. **Treat replay as reconciliation.** Replay reads `attributes.promptId/userMessageId` when present, preserves old sessions without IDs by content/order fallback, and never duplicates optimistic records. Internal hook parts are filtered from all user-facing paths.
9. **Do not auto-resend uncertainty.** Missing result/stream evidence produces an explicit uncertain/failed state. Automatic retry is allowed only where the engine contract proves the earlier submission was not accepted.
10. **Reuse scenario contracts, not foreign architecture.** Claude and `app-client` supply IDs, phases, queue restoration and acknowledgement cases. KIMI KRINIK keeps its engine, bridge and React/Zustand boundaries.

## 6. Recommended phase shape

- **Phase 0 — characterization:** old-path inventory and red regressions for every requirement; no production behavior change.
- **Phase 1 — honest engine result:** propagate `PromptSubmissionResult`, engine prompt IDs through live/replay events; remove unconditional success echo.
- **Phase 2 — outbound lifecycle:** immediate optimistic records, stale-response isolation, visible queue, exactly-once fallback and media ownership.
- **Phase 3 — timeline reconciliation:** separate user entries, avatar order, thumbnails/viewer, hook filtering and old-session compatibility.
- **Phase 4 — isolated acceptance and hardening:** deferred races, restart, two clients, Windows VSIX, logs and WebP evidence.

Each phase has its own red-to-green gate. The next operational plan covers phase 0 only; later operational plans are written with the previous phase's observations.

## 7. Open forks for the owner

No vision-level fork blocks the proposed first phase: current owner messages already define the user-visible behavior.

Two implementation choices are recorded for review rather than silently treated as permanent architecture:

- [AI] Keep the public SDK unchanged initially; correlate the RPC result with `turn.started.promptId` and replay attributes. Revisit only if a required transition cannot be observed.
- [AI] On restart with unknown delivery, show uncertainty and preserve content instead of automatically resending. This follows the duplicate-delivery warning in the Agent SDK contract.

Multi-webview optimistic presentation is a later acceptance question: the sender must be immediate, while another client currently receives host/engine events. Changing that broadcast behavior is outside phase 0 and should be decided before phase 2 if cross-client immediacy is required.

## 8. Source index

- [Claude Code in VS Code](https://code.claude.com/docs/en/vs-code)
- [How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works)
- [Interactive mode](https://code.claude.com/docs/en/interactive-mode)
- [Agent SDK TypeScript reference](https://code.claude.com/docs/en/agent-sdk/typescript)
- [Ably optimistic updates](https://ably.com/docs/ai-transport/features/optimistic-updates)
- [Claude Code issue #82772 — orphaned dequeue](https://github.com/anthropics/claude-code/issues/82772)
- Installed official bundle: `~/.vscode/extensions/anthropic.claude-code-2.1.331-win32-x64/extension.js` and `webview/index.js`
- Local prior art: `packages/app-client/src/client/usePromptPipeline.ts`, `packages/app-client/src/stores/prompt.ts`, `packages/app-client/test/workspace-state.test.ts`
- Owner defects: `bugs/11`–`bugs/16`
