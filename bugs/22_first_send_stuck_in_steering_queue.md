# Bug 22 — First Send appears lost and requires a steering lightning retry

**Status:** 🔧 exactly-once contracts implemented; main-profile build-9 restart/acceptance pending
**Version/build:** KIMI KRINIK 1.0.0 · owner's accumulated VS Code profile · **When/context:** 2026-11-24 16:38 +03:00, urgent owner release blocker before the requested replacement VSIX
**Severity:** S2
**Fixing:** this session before building and installing the replacement VSIX
**Fix accepted when (observable):** the first idle, steering and automatically dequeued message appears immediately with a stable internal `clientId`; its later `TurnBegin` or `SteerInput` reconciles the same entry without a duplicate; AUTO STEER OFF sends a queued item when the host is already idle, and ten repeated user actions cannot create ten durable entries.

## Symptom

The owner repeatedly reports that the first message does not go, appears in steering and needs the lightning action before it is delivered. This makes ordinary work in the current VSIX unreliable.

## Repro

1. Send an idle message before any engine acknowledgement and inspect the visible conversation.
2. During an active turn, send a steering message and then receive its durable `SteerInput`.
3. With AUTO STEER OFF, complete a turn and then queue a message while the host is already idle; require automatic delivery without a lightning click.
4. Reconcile each event by `clientId` and count user entries and transport calls.

## Expected result

Every first Send has an immediate visible response and exactly one lifecycle. The selected ON/OFF path is preserved, replay/events without IDs remain compatible and a genuine failure restores only the current draft.

## Actual result

The first action appears not to work, the message lands in steering and repeated actions/retries are needed. Recent logs show ordinary `streamChat` and multiple `steerChat` calls across retries; the current UI creates visible entries only after later engine events.

2026-11-24 19:07 +03:00 — build 3, owner's accumulated profile, AUTO STEER ON: the owner reported two sends after one Enter and reproduced the duplication with a second single-Enter message. The supplied screenshot shows one user bubble and the sent text restored in the composer; exact transport and durable-history counts still require instrumentation. The composer symptom is tracked in `bugs/12`. This real-path result reopens the exactly-once contract despite the earlier isolated pass.

Later on build 3 the owner supplied the full visible chat transcript: the same Russian copy-editing request appears twice verbatim in the user stream, and the delayed agent reply was itself delivered twice. This independently confirms that the real-profile duplicate is not a one-screenshot misreading.

## Forensics

- `chat.store.ts:220-234` records `pendingInput` for an idle send but creates no immediate user entry.
- `chat.store.ts:279-312` starts steering without an optimistic visible record or correlation ID.
- `event-handlers.ts:331-355` creates the user/assistant pair only for `TurnBegin`; `SteerInput` is nested later in assistant steps.
- `chat.store.ts:562-582` refuses `sendNextQueued` while stale `isStreaming` remains true and has no host-idle recovery when no later `stream_complete` arrives.
- The owner's fresh output log contains repeated normal and steering transport calls, so the missing immediate lifecycle/feedback and the duplicate delivery risk are both real.

## Root cause / Hypotheses

The outbound path has no stable optimistic record with a client-generated correlation ID. UI acknowledgement and durable events are separate, while queue advancement depends only on a future completion event. The direct missing behaviors are confirmed; the exact stale-state sequence is pinned by regressions rather than guessed.

## Fix plan

Create an immediate optimistic user/assistant pair with an internal `clientId` for idle, steer and automatic queue delivery. Propagate that ID through the existing webview bridge, runtime and live events, reconcile instead of appending duplicates and discard it on a genuine failed current send. Query host activity when a queued item may have arrived after completion, so host-idle delivery does not require lightning. Preserve public SDK contracts and old events/replay without IDs. Run race/queue/component suites, full hygiene and isolated VSIX before installing the owner's build.

## Decisions made without the owner

Used an extension-internal `clientId` rather than changing the official SDK, matching the already accepted two-ID direction in `plans/01`. Prioritized the owner's concrete first-send blocker over the longer characterization-only phase; no public release is authorized by this fix.

## Links

- `bugs/11_steer_delivery_and_immediate_display.md`
- `bugs/14_steer_queue_not_added.md`
- `bugs/18_reentrant_prompt_internal_error.md`
- `bugs/20_queue_steer_duplicate_submission.md`
- `researches/54_chat_pipeline_reliability.md`

## Fix evidence — 2026-11-24 22:02 +03:00

Optimistic append is idempotent by `clientId`, including running→idle fallback. Runtime and host now preserve the complete `PromptSubmissionResult`; running/queued/blocked have separate contracts, queued prompts correlate at later turn start, and a non-steered running submission becomes its own `TurnBegin` instead of an unconditional `SteerInput`.

Hygiene: the original fallback test was red with two user entries; it is green with one before and after durable reconciliation. Runtime/host and store/settings suites are green after the change.
Functional run: fresh-process build 6 passed the scoped OFF selected-item queue case. The owner's main-profile ON duplication is not yet re-observed on build 12; full VS Code restart remains required.
