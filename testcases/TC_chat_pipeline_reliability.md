# Test cases — Epic 01 outbound chat pipeline reliability

**Created:** 2026-11-24 · **Under test:** KIMI KRINIK extension runtime, host bridge, webview store and replay/render adapters · **Version/build:** current working tree after `8ac5df733`, with the pre-existing uncommitted UI edits preserved
**Test basis:** `GOAL.md` success criteria 3–4; `bugs/11`–`bugs/16` acceptance lines; `plans/01_EPIC_chat_pipeline_reliability.md` AC1–AC8 and §4; `plans/02_epic01_characterize_chat_pipeline.md`; `researches/54_chat_pipeline_reliability.md`; `packages/node-sdk/src/types.ts` `PromptSubmissionResult`; `packages/node-sdk/src/session.ts` `prompt({ promptId })` and `steer()`.

## 1. Goal vector

**Achieve.** A user action creates one immediately visible outbound entry whose text and attachments reach the engine and durable history exactly once.

**Maintain.** The official SDK result and prompt identity remain authoritative. Events and replay records without IDs retain their existing content/order behavior, and a genuine failure of the latest unsent message still restores its text and media.

**Avoid.** Lost or duplicate messages, false running/queued/blocked success, stale composer restoration, assistant-before-user timeline order and visible internal hook instructions.

This document characterizes the current implementation. A failing contract is the expected Phase 0 result, not a functional acceptance pass and not a reason to change production code in this phase.

## 2. Requirements under test

| # | Requirement (EARS sentence) | Fit criterion (Scale · Meter · Target) |
|---|---|---|
| R1 | WHEN a user sends during a running turn, the system shall expose the complete SDK submission result through runtime and host boundaries | Result fields · `session-runtime.test.ts` and `bridge-handler.test.ts` · `promptId`, `createdAt`, `state` and `steered` preserved for running, queued and blocked |
| R2 | WHEN a user sends steering text or media, the system shall show one user entry before the transport acknowledgement | Message count/content and timing · deferred `steerChat` in `chat-store.test.ts` · entry and media visible before Promise settlement |
| R3 | WHEN steer submissions settle out of order, the system shall update only the matching outbound entry | Reverse-order completion · `chat-store.test.ts` · no obsolete `composerRestore`, no stale media restoration and no mutation of the newer entry |
| R4 | WHILE AUTO STEER is OFF or the engine reports queued, the system shall expose a visible queued projection and promote it by prompt identity | Queue DOM/state · `status-pills.test.tsx` and `chat-store.test.tsx` · one queued row, one promotion and no duplicate user entry |
| R5 | IF the engine reports blocked or the latest request rejects, THEN the system shall expose failure without reporting accepted steering and shall restore only the current failed draft | Decision table · runtime/host/store suites · blocked is not accepted; latest text and ready media restore exactly once |
| R6 | WHEN a running turn ends during steering, the system shall continue through the ordinary prompt path with one correlated prompt identity and one final user entry | Call count and `TurnBegin.promptId` · `chat-store.test.ts` · one steer call, one stream call and one final user entry |
| R7 | WHEN live or replayed turns carry prompt attributes, the system shall propagate `promptId` and `userMessageId` and reconcile matching entries | Adapter event payload and message count · event/replay/store suites · IDs retained; old records without IDs keep content/order; no optimistic/durable duplicate |
| R8 | WHEN steering renders media, assistant sections or internal hook parts, the system shall keep user entries before following assistant avatars, open media in the viewer and hide hook text | DOM order, thumbnail click and visible event content · chat-message/replay suites · image and video open the same URI; hook text produces no visible `ContentPart` |

## 3. Frozen current-path inventory

| Contract or behavior to preserve | Current observed implementation | Phase 0 observation required |
|---|---|---|
| AUTO STEER ON calls `session.steer`; OFF uses the ordinary queue | `chat.store.ts:257-312`, `session-runtime.ts:372-380` | ON/OFF fixtures remain separate; existing idle and OFF controls stay unchanged |
| SDK steer returns `PromptSubmissionResult` | `packages/node-sdk/src/types.ts:291-297`, `session.ts:217-223` | Runtime currently discards it; host currently returns only `{ ok: boolean }` |
| `SteerChat` accepts `content: string \| ContentPart[]` | `shared/bridge.ts:222-223`, `chat.handler.ts:176-181` | Parameter validation and legacy media content remain unchanged |
| `SteerInput` carries `user_input` | `shared/legacy-sdk.ts:165`, `session-runtime.ts:375-379` | Current runtime emits it unconditionally; queued/blocked controls must refute that behavior |
| `TurnBegin` carries `user_input`, optional `turnIndex` and `forkable` | `shared/legacy-sdk.ts:62-65,154`, `event-adapter.ts:102-116` | Current live/replay payload lacks prompt identity; old events without IDs remain covered |
| SDK `turn.started.promptId` is optional | `packages/agent-core-v2/src/agent/loop/turnEvents.ts:35-42` | Present and absent forms have separate adapter cases |
| Replay user attributes can carry `promptId`, `createdAt` and `userMessageId` | `packages/core/src/llm/message.ts:171-179`, `packages/node-sdk/src/context.ts:100-105` | Current replay drops them; old records without attributes remain covered |
| Queue item contains `id`, `content` and `model` | `chat.store.ts:89-93,534-582` | Queue insertion/removal and FIFO behavior remain observable without relying on random ID values |
| Legacy media uses snake-case keys; SDK uses camel-case keys | `session-runtime.ts` `toSdkPromptInput`; existing runtime/replay media tests | Existing conversion assertions remain unchanged and act as media controls |
| `pendingInput` supports retry of the original turn | `chat.store.ts:220-234,314-338` | Existing rejected-steer retry test must still pass |
| Only the latest failed draft may restore | `chat.store.ts:303-310,523-525` | Existing single/latest failure control remains; an older completion must not overwrite it |
| Old replay has no IDs and uses content/order | `replay-adapter.ts:90-137` | Existing no-ID cases remain unchanged |
| Hook parts belong to engine input, not visible assistant output | `replay-adapter.ts:95-127`, owner requirement in `bugs/15` | `Merged prompt` remains visible; `merged hook note` produces no visible content |
| Existing session broadcast remains in place | `SessionRuntime.emitStreamEvent` and current bridge tests | No multi-webview optimistic broadcast is characterized or changed in Phase 0 |

## 4. Coverage matrix — dimensions and holes

| Dimension | Values covered by characterization | Explicitly NOT covered here |
|---|---|---|
| Positive smoke | idle text · running accepted text · OFF queued text | packaged VSIX smoke belongs to Phase 4 |
| Engine result | running · queued · blocked · host idle fallback | real provider/network errors beyond mocked rejection |
| Timing | deferred acknowledgement · two reverse-order settlements · running→idle fallback | three or more live concurrent sends; real engine timing belongs to Phase 4 |
| Content | multiline existing control · text+image · media-only · video | real HEIC conversion, large files and Windows file URI upload |
| Identity | `promptId` present/absent · `userMessageId` present · content/order fallback | restart with unknown delivery and automatic retry policy implementation |
| Queue | immediate insertion · queued promotion · exactly-once fallback | two connected webviews and cross-client optimistic echo |
| Timeline | one and two consecutive steers · assistant avatar order · replay | full packaged screenshots and owner's accumulated profile |
| Internal data | UserPromptSubmit hook present · hook absent through existing replay cases | live hook firing contract; Phase 4 must observe it |
| Platform | jsdom/Vitest on Windows | Linux/macOS and real VS Code Extension Host |

## 5. Cases and requirement traceability

Statuses: `pass` · `fail` · `blocked` · `skipped`. In this characterization phase, `fail` means the new assertion failed on the named original behavior; a fixture/type error is a stand defect instead. These are hygiene contracts, not functional runs on the real product.

| ID | Bug / requirement | Case and owning suite | Expected original failure | Status + evidence |
|---|---|---|---|---|
| CP00 | R1–R6 / positive smoke | Existing idle send, running Enter and OFF queue cases in `webview/chat-store.test.ts` | No new failure expected; these are controls | [NOT-TESTED] |
| CP01 | bug 11 / R1 | Runtime returns the complete running/queued/blocked submission in `session-runtime.test.ts` | `runtime.steer()` resolves `undefined` instead of the SDK object | [NOT-TESTED] |
| CP02 | bug 11 / R1 | Runtime suppresses `SteerInput` for queued and blocked while retaining the running control | Current runtime emits unconditional `SteerInput` | [NOT-TESTED] |
| CP03 | bug 11 / R1 | `SteerChat` preserves the complete submission and legacy content in `bridge-handler.test.ts` | Host returns only `{ ok: true }` | [NOT-TESTED] |
| CP04 | bug 11 / R7 | `event-adapter.test.ts` maps `turn.started.promptId`; the existing no-ID event remains unchanged | `TurnBegin.payload.promptId` is absent | [NOT-TESTED] |
| CP05 | bugs 11, 13 / R7 | `replay-adapter.test.ts` maps user attributes; existing old-record cases preserve content/order | `promptId` and `userMessageId` are absent | [NOT-TESTED] |
| CP06 | bugs 11, 13 / R2 | Deferred `steerChat` in `chat-store.test.ts`; require text+image user content before settlement | No optimistic user entry exists | [NOT-TESTED] |
| CP07 | bug 12 / R3 | Two deferred requests settle newer-success then older-rejection in `chat-store.test.ts` | Older rejection sets `composerRestore` and returns stale media | [NOT-TESTED] |
| CP08 | bugs 11, 14 / R4–R5 | Store models queued and blocked submission states in `chat-store.test.ts` | Legacy `{ ok: true }` handling clears media and creates no correct queued/failed projection | [NOT-TESTED] |
| CP09 | bug 11 / R6 | Running→idle fallback in `chat-store.test.ts` uses one prompt ID and one final user entry | No prompt ID reaches the ordinary stream call or `TurnBegin` | [NOT-TESTED] |
| CP10 | bug 14 / R4 | `status-pills.test.tsx` enqueues text+media synchronously, opens the row and promotes matching `promptId` | Queue survives promotion and duplicates the durable user entry | [NOT-TESTED] |
| CP11 | bug 16 / R8 | Store-driven two-steer rendering in `chat-message.test.tsx` puts each user correction before the following assistant avatar | One assistant avatar precedes both nested steer items | [NOT-TESTED] |
| CP12 | bug 13 / R8 | Legacy steer media in `chat-message.test.tsx` renders image/video thumbnails and opens the viewer with the same URI | `SteerBubble` renders text only | [NOT-TESTED] |
| CP13 | bug 15 / R8 | Existing replay hook case in `replay-adapter.test.ts` requires `Merged prompt` but no visible `merged hook note` | Current adapter emits the hook as `ContentPart` | [NOT-TESTED] |
| CP14 | bugs 11, 13 / R7 | Store receives a durable `TurnBegin` matching an optimistic prompt identity in `chat-store.test.ts` | Current handler appends a second user/assistant pair | [NOT-TESTED] |
| CP15 | bug 12 / R5 control | Existing latest/single rejection restores exact current text and ready media in `chat-store.test.ts` | No new failure expected; this guards against dropping genuine restoration | [NOT-TESTED] |

Bug-to-contract index: bug 11 → CP01–CP04, CP06, CP09, CP14; bug 12 → CP07 and CP15; bug 13 → CP05–CP06, CP12, CP14; bug 14 → CP08 and CP10; bug 15 → CP13; bug 16 → CP11.

## 6. Control cases — MUST

| # | Control → expected: the behaviour is absent | Status + evidence |
|---|---|---|
| K1 | Running submission → the existing runtime `SteerInput` control remains visible; queued/blocked → no success echo | [NOT-TESTED] |
| K2 | Turn/replay records without IDs → existing payload and content/order remain unchanged | [NOT-TESTED] |
| K3 | Latest genuine rejection → exact current text and ready media restore once; older rejection → no composer restoration | [NOT-TESTED] |
| K4 | Hook-free user text → `Merged prompt` remains; injected hook text → no visible assistant content | [NOT-TESTED] |
| K5 | Existing legacy media conversion and original-turn retry → current assertions remain green | [NOT-TESTED] |

@guard chat-pipeline-characterization
THREAT: owner-observed steering, queue, media, avatar and internal-hook defects are hidden by mocks that encode successful legacy behavior.
PROVED-AGAINST: NOT YET — the contracts have not run on the original implementation.
GAP: jsdom and mocked SDK boundaries do not prove the packaged VSIX, real provider timing, real media upload, two clients or the owner's accumulated profile.
ON-REAL-PATH: NOT YET — Phase 4 owns isolated VSIX observation.

## 7. Verdict

[NOT-TESTED] — the inventory and contracts are defined, but no characterization run has been read yet. No production implementation, functional acceptance, bug closure or release readiness is claimed.
