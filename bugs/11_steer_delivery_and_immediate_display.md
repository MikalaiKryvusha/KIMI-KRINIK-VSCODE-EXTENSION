# Bug 11 — Steering messages are sometimes lost and appear only after engine acknowledgement

**Status:** 🔴 OPEN
**Version/build:** KIMI KRINIK 1.0.0 · `8ac5df733` · installed VSIX on the owner's accumulated VS Code profile · **When/context:** 2026-11-24 13:09 +03:00, owner live steering acceptance
**Severity:** S2
**Fixing:** next work session inside KIMI KRINIK; run and verify fixes in an isolated VS Code environment
**Fix accepted when (observable):** during a running turn the user's bubble appears immediately on Send, before the steer acknowledgement; at the running→idle boundary every message is delivered exactly once through steer or the idle fallback, with no loss or duplication, and the same bubble remains after completion and reload.

## Symptom

The owner reports that steering messages do not always appear in chat, seem to wait for something, and occasionally go nowhere at a particular moment. The required behavior is immediate display on the user's send action, not display after an engine event.

## Repro

1. Start a long-running turn with AUTO STEER ON.
2. Send several text follow-ups, including one immediately before the running turn completes.
3. Observe the moment each bubble appears, the delivered model requests, and the history after completion and reload.

The exact losing transition is not yet deterministic; the turn boundary is the first reproduction axis, not a confirmed root cause.

## Expected result

`GOAL.md` requires Enter during a turn with Steer ON to send immediately. The owner additionally requires the visible bubble to be added synchronously on Send and every message to survive the running→idle transition exactly once.

## Actual result

Some steering bubbles wait for later events; the owner also observed sends that apparently never take effect.

## Forensics / hypotheses

- `apps/vscode/webview-ui/src/stores/chat.store.ts:279-312` starts `bridge.steerChat` without adding an optimistic visible steer item.
- `apps/vscode/src/runtime/session-runtime.ts:372-379` emits `SteerInput` only after `await this.session.steer(...)` succeeds.
- `apps/vscode/src/handlers/chat.handler.ts:176-181` returns `{ ok: false }` when the runtime is no longer busy; the store then calls `sendIdle`.
- Existing store tests cover mocked acknowledgement and fallback but do not prove synchronous rendering or the real engine race.

## Fix plan

Add a regression that observes the bubble before releasing a deferred steer acknowledgement and a real isolated-VS-Code turn-boundary scenario. Reconcile optimistic items with the later `SteerInput` event without duplication. Preserve text, media and ordering through accepted, rejected and late-completing requests.

## Decisions made without the owner

Grouped immediate display and boundary delivery because they share one steering state machine; their code causes remain unproven. No product code was changed in this report.

## Owner observation — build 12

2026-11-24 23:50 +03:00 — [OWNER] «сборка 12 вроде работает стабильнее по чату», «тебе быстро мои стиринг сообщения доходят» (чат). This is positive main-profile evidence for steering delivery, not yet proof of the complete running→idle exactly-once acceptance criterion.

## Owner observation — assistant response disappeared after steering

2026-11-25 10:48 +03:00 — [OWNER] «ты только что писал ответ, а затем он исчез - похоже на баг», «вероятно, стиринг сообщения пользователя могут как-то "ломать" ответы КИМИ в чате» (чат).

This is a new related symptom on the owner's accumulated build-12 path: a visible assistant answer disappeared after a user steering message. The cause is not proven and must not be inferred from the steering timing alone. The acceptance boundary now explicitly includes assistant entries remaining present after steering, completion and reload, in addition to the user's own bubbles.

Next-session reproduction: hold an assistant response, send a user steer, and compare a DOM MutationObserver trace with `SteerInput`, `TurnBegin`, history replay and completion events. Record whether the assistant container is removed, replaced, duplicated, or merely scrolled out of view. Link the exact event/state transition before editing the shared chat store.

## Links

- `testcases/TC_K5_live_acceptance.md` C09 and C19
- `bugs/12_steer_composer_restores_previous_text.md`
- `bugs/13_steer_attachments_and_thumbnails.md`
