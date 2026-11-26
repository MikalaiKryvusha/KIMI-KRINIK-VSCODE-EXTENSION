# Bug 44 — steering can incorrectly trigger the “task completed” attention event

**Status:** 🔧 CANDIDATE FIX — real guest-DOM steering/audio acceptance pending
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

`SessionRuntime.emitTerminal` emitted `stream_complete` for every terminal turn. It did not check whether a later steering turn had already started or an accepted queued steer still waited for its turn. Since `notifyEventAttention` maps every finished `stream_complete` to the completion sound, an older turn's completion could sound while the agent continued.

## Candidate fix

Track active main-turn ids in `SessionRuntime`. After each terminal, settle its prompt but emit `stream_complete` only when no active turn remains, no accepted queued steer waits and no exclusive/host work remains. Ordinary single-turn completion and error reporting remain unchanged.

Regression evidence: both new cases were red before the fix and pass afterward. Targeted 121/121 and full extension 658/1 pass; typecheck and lint pass. Build 46 is packaged, audited, installed on main and isolated profiles, and its Extension Host smoke opens the webview on VS Code 1.123.0.

Real guest-DOM steering/audio acceptance is not verified. `page.frames()`, direct guest attachment, `Runtime.evaluate` and `DOM.getDocument` exposed only an outer guest target without the composer, so no claim about the actual sound is made. Next session needs a fresh working guest harness to finish the acceptance. Report: `testcases/reports/2026-11-26_steer_completion_attention.md`.

## Decisions made without the owner

Recorded as a separate attention-lifecycle defect rather than folded into message-loss bugs: the audible event is wrong even when chat delivery itself succeeds. No implementation decision has been made.

## Links

- `bugs/11_steer_delivery_and_immediate_display.md`
- `bugs/20_queue_steer_duplicate_submission.md`
- `bugs/32_steer_working_indicator_jumps.md`
- `bugs/10_DONE_sound_volume_race.md`
