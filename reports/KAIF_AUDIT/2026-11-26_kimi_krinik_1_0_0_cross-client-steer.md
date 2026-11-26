# Audit 001 · Family: correlated steer in a non-originating client

**Mechanism:** sender-only optimistic identity selects a reconciliation path that another attached client cannot enter, leaving a nested or dropped durable event.
**Already guarded by:** the originating-client reconciliation and runtime broadcast; no non-originating-view case.
**Occurrences:** F1.

## F1 — A correlated steer is nested or dropped in the second client

**Quote:** `apps/vscode/webview-ui/src/stores/event-handlers.ts:625` — `if (reconcileOptimisticTurn(draft, payload.user_input, payload.clientId, undefined, undefined, false)) {`.

**Failure scenario:** client A owns the optimistic `clientId`; client B receives the same broadcast without that record. B falls into the legacy nested `steer` item, or drops the event if no current step exists. Replay later shows a separate turn, so the message moves after reload.

**Severity:** Attend — content can be absent or misordered in a second client; high likelihood when two clients use immediate steering.

**Baseline:** new mechanism; general two-client acceptance was deferred, but this sender/receiver divergence was not named.

kaif-fp: apps/vscode/webview-ui/src/stores/event-handlers.ts :: correlated-steer-fallback-divergence :: v2.10

**Dedup attestation:** searches for two-client terms found EXP-0008, `testcases/TC_chat_pipeline_reliability.md` and `researches/54`; none covers this fallback mismatch. Existing sender tests always supply the optimistic record.

**Fix sketch:** when a `SteerInput` has a `clientId` but no local optimistic match, append the same correlated standalone turn as the sender. Keep nested presentation only for genuinely uncorrelated legacy events; a later prompt-only TurnBegin must reconcile without duplication.

**Fix accepted when:** `renders a correlated steer as a separate turn in a non-originating view` passes through the real store and runtime fanout, including the no-current-step case and later TurnBegin. Run `pnpm exec vitest run --reporter=agent apps/vscode/test/webview/chat-store.test.ts apps/vscode/test/session-runtime.test.ts -t "non-originating view"`. Today's real-store probe produced a nested item with an existing step and `messageCount: 0` without one.

**Do not touch:** originating-client immediacy, old events without IDs, runtime fanout and bridge/RPC shapes.

**Meta:** links bugs 16/22, EXP-0008 and `researches/54_chat_pipeline_reliability.md`. Skeptic confirmed the mechanism through the real chat store; no live second-VSIX-client observation yet.
