# Bug 44 — steering can incorrectly trigger the “task completed” attention event

**Status:** 🔧 ISOLATED ACCEPTANCE PASS on packaged build 49 — accumulated main-profile and audible-output boundaries pending; not DONE
**Version/build:** KIMI KRINIK 1.0.0, owner's accumulated profile · **When/context:** 2026-11-26 18:29 +03:00, owner report during steering
**Severity:** S2
**GitHub issue:** https://github.com/MikalaiKryvusha/KIMI-KRINIK-VSCODE-EXTENSION/issues/1
**Fixing:** immediately after the current KAIF closure-refresh fix reaches its verified cut

**Goal vector:** **Maintain + Avoid.** The “task completed” event and its sound must mean only that the agent has become idle and is waiting for a new user message. Accepted steering that leaves the agent working must not produce completion attention.

**Fix accepted when (observable):** during a running turn, each accepted steering submission produces no completion event/sound while work continues; a later genuine transition to idle waiting for user input produces exactly one completion event/sound. Queue, steer, replay, error and completion paths preserve their distinct behavior, with red-before-fix tests at the smallest public boundary and a real VS Code run whose emitted attention events are read.

## Symptom

The owner reports that sending a steering message sometimes triggers the “Задача завершена” event and its audible notification even though the agent continues working.

## Expected result

[OWNER] «Этот ивент должен воспроизводиться ТОЛЬКО когда агент стал на паузу, и ждет отправки нового сообщения в чат. ... я отправил стиринг сообщение, и работа не останавливается агент работает дальше - это не повод поднимать ивент "задача завершена"» · 2026-11-26 18:29 +03:00 (chat).

## Actual result

The completion attention sometimes fires on steering submission while the agent is still active. The exact triggering event sequence is not yet captured.

## Repro

1. Start a long-running turn with AUTO STEER ON and completion sound enabled.
2. Send a steering follow-up and record `TurnBegin`, `SteerInput`, `stream_complete`, runtime activity and emitted attention events in one timeline.
3. Verify that no completion attention is emitted while subsequent model/tool activity continues.
4. Let the agent actually become idle and verify one completion notification at that boundary.

The intermittent transition still needs deterministic reproduction; do not infer the cause from the audible symptom alone.

## Root cause

Three lifecycle gaps produced the same false completion:

1. Accepted running `turnId` values were added to `activeTurnIds` only by a later `turn.started`, leaving an accepted-before-start window.
2. `emitTerminal` did not account for a `session.steer()` request still awaiting its result. The live build-47 sequence was `StepInterrupted → stream_complete(finished, turn 0) → StepBegin → SteerInput`.
3. `completeHostAction` emitted unconditionally. During `/compact` with a follow-up, build 48 emitted host completion and audio before the queued turn's `TurnBegin`.

## Fix

Register accepted running IDs immediately, count in-flight steering and defer completed/cancelled completion until the outcome is known. Accepted running/queued work clears the deferral; blocked or rejected outcomes release a genuine completion only if the runtime is idle. Host actions use the same gate, with no fabricated `turnIndex`. Ordinary single-turn completion, same-turn steering, error reporting and replay remain unchanged.

Regression evidence: all three red groups were observed before their fixes. `session-runtime` is 52/52; the full extension suite is 664 passed / 1 skipped, with typecheck and root lint green. Build 49 is packaged, audited and installed on main and isolated profiles.

Real guest-DOM steering/audio acceptance passed on isolated build 49:

- Immediate: zero completion/audio between `StepInterrupted` and subsequent work; exactly one `stream_complete(turnIndex=1)` and one `Audio.play` at idle.
- Accepted queued during `/compact`: zero completion/audio through the follow-up `TurnBegin`; exactly one `stream_complete(turnIndex=2)` and one `Audio.play` at idle.
- Synthetic `turnComplete` playback rejects with `NotAllowedError`, so this is an attention-event/play-attempt observation, not an audible-output claim. A real Glass control played to `ended`.

Hygiene: 52/52 runtime, 664/1 full extension, typecheck, lint and package audit pass.
Functional run: real packaged guest DOM, bridge and native audio events read; WebP 202/203 inspected. Report: `testcases/reports/2026-11-27_steer_completion_attention_build49.md`.

REAL WORLD: accumulated — owner's main VS Code profile with existing sessions and configuration; data and machine — his Windows machine; path — Second Side Bar immediate/queued steering and `/compact`. Verified on the isolated packaged product with real state from the fake-model stand; not verified on the accumulated main profile, so DONE is not claimed.

TWINS: searched `activeTurnIds.add`, `waitingForInput`, `session.steer(` and every `type: "stream_complete"` emitter. The third emitter, `completeHostAction`, was found and fixed. `replay-adapter.ts` also emits completion, but replay intentionally suppresses attention; no fourth live emitter was found.

TWINS-MECH: premature completion can arise from turn IDs registered late, unsettled outbound requests, or a second terminal emitter bypassing the idle predicate. All three syntaxes were searched and covered by public runtime regressions.

AFTER-WORK: `activeTurnIds` records accepted work; `steerInFlight` records an unsettled request; `deferredCompletions` preserves a terminal while the request is unresolved. If execution dies after accepted registration, later terminal ownership remains; if it dies before acceptance, blocked/rejected settlement releases only a genuine idle completion and never fabricates a turn index.

## Decisions made without the owner

Recorded as a separate attention-lifecycle defect rather than folded into message-loss bugs. Kept one deferred-completion mechanism for SDK and host terminals instead of adding a second pending-running state. Accepted running/queued outcomes discard the deferral; blocked/rejected outcomes release it only at genuine idle. The isolated event sequence is accepted, while the file remains open rather than DONE because the accumulated main profile and audible speaker output are still unverified.

## Links

- `bugs/11_steer_delivery_and_immediate_display.md`
- `bugs/20_queue_steer_duplicate_submission.md`
- `bugs/32_steer_working_indicator_jumps.md`
- `bugs/10_DONE_sound_volume_race.md`
