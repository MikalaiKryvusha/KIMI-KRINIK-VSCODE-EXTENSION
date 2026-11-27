# Bug 47 — A late steering acknowledgement can leave Working active after every turn completes

**Status:** 🔧 ISOLATED ACCEPTANCE PASS on packaged build 57; accumulated main-profile acceptance remains open, not DONE
**GitHub issue:** https://github.com/MikalaiKryvusha/KIMI-KRINIK-VSCODE-EXTENSION/issues/36
**Version/build:** KIMI KRINIK 1.0.0 packaged build 55 · **When/context:** 2026-11-27 12:35–12:44 +03:00, Epic 04 Phase 3 isolated race acceptance
**Severity:** S2
**Fixing:** this session, inside `plans/07_epic04_phase3_message_visibility_steering.md` §4.2–4.3

**Goal vector:** **Maintain + Avoid.** The Working indicator and stop button shall reflect actual outbound work. A steering acknowledgement that arrives after its turn's terminal event shall not resurrect that turn or suppress the genuine final completion.

**Fix accepted when (observable):** a non-steered running turn that starts and ends before `session.steer()` resolves still emits exactly one genuine idle `stream_complete` with its turn index; the packaged two-steer path reaches terminal idle with no Working indicator or stop button after provider and durable completion, and replay preserves the settled view. Existing same-turn, accepted-queued, blocked/rejected and ordinary completion controls remain green.

## Symptom

After two quick steering actions the assistant response appears, but Working and the stop button remain indefinitely. The composer stays in steering mode although the fake provider reports `finished` and durable wire records `turn.ended(reason:"completed")` plus `prompt.completed` for every turn.

## Repro (deterministic)

1. On packaged build 55 with AUTO STEER ON, start a held first prompt in a fresh isolated VS Code session.
2. Send two steering messages in quick succession through the real composer.
3. Let the second submission join the same restart request, then release the fake model.
4. Read the visible response, provider requests and durable wire. The response remains visible while Working does not settle.

Public runtime reproduction added in `apps/vscode/test/session-runtime.test.ts`:

```bash
pnpm exec vitest run --reporter=agent apps/vscode/test/session-runtime.test.ts -t "does not resurrect a non-steered turn"
```

The test emits `turn.started(2)` and `turn.ended(2)` before resolving the `running(turnId=2, steered:false)` acknowledgement. Before the fix it fails with `expected [] to have a length of 1 but got +0` for finished `stream_complete` events.

## Forensics

- Packaged frame: `.tmp/k5-vscode/56-phase3-clean-working-stuck.webp` — the final response is visible together with Working and the stop button; the image was opened and read.
- DOM trace: `.tmp/k5-vscode/phase3-clean-consecutive.json` — all three user bubbles and the assistant response remain present; no message-loss failure is recorded.
- Provider evidence: requests 3 and 4 belong to session `session_e3705c95-2276-46e0-8e1c-ec71cac66a0c`; request 3 is `aborted`, request 4 is `finished` and contains `P3 clean initial`, `P3 clean first steer` and `P3 clean second steer` exactly once each.
- Durable wire for that session records turn 0 completed, turn 1 started/completed, then turn 2 started, response text and completed. No active turn remains in the engine record.
- The earlier long-held control produced a genuine 30-second timeout and is not used as evidence for this defect. The stuck-Working run has finished provider and durable terminal records, so it is not a hold-timeout explanation.

## Root cause

`SessionRuntime.steer()` adds `result.turnId` to `activeTurnIds` after `await this.session.steer(...)`. If the corresponding `turn.started` and `turn.ended` have already arrived, the terminal removed that ID and deferred its completion while `steerInFlight > 0`; the late acknowledgement then re-adds the finished ID and clears the deferred completion. `waitingForInput` stays false forever, so the genuine later idle transition emits no `stream_complete`.

The red-before public regression reproduces this exact order and fails with zero completions. Existing same-turn re-arming is a distinct required path and must not be removed to make this case pass.

## Fix plan

1. Do not re-register a non-steered running turn whose terminal key was already observed. Preserve same-turn re-arming for the existing accepted `steered:true` lifecycle.
2. Release deferred terminals at genuine idle after the acknowledgement settles; accepted work that is still active continues to suppress premature completion.
3. Run the new regression red-before/green-after, the full runtime suite and packaged two-steer/replay acceptance. Preserve the blocked/rejected and accepted-queued controls.

## Fix implementation and verification — 2026-11-27 13:18 +03:00

`SessionRuntime.steer()` now recognizes a non-steered terminal key that arrived before its acknowledgement, avoids re-registering that finished turn and releases only that turn's deferred completion at genuine idle. An intermediate implementation released every deferred completion and correctly failed the same regression with two completions; the final targeted-key version emits exactly one. Same-turn `steered:true` re-arming and accepted-queued behavior remain unchanged.

Hygiene: the new regression failed before the fix with zero completions and passes afterward. Runtime is 55/55 before the additional correlation case; the final combined extension suite is 679 passed / 1 skipped, with typecheck and root lint green.

Functional run: packaged build 56 reached idle after two steering actions, confirming the original stuck-Working mechanism. The same run exposed the separate response-ownership defect recorded in `bugs/25`; the combined build-57 run must verify idle, distinct response preservation and replay together before this bug can be considered for DONE.

TWINS: searched `activeTurnIds.add`, `terminalKeys.has`, `deferredCompletions.clear` and `session.steer(` across `apps/vscode/src`. The only other ID registration is the actual `turn.started` path; no second late-acknowledgement registration site exists. The wrong-prompt and missing-metadata mechanisms found during the same trace are tracked in `bugs/25` and fixed in the same combined gate.

AFTER-WORK: `activeTurnIds` holds accepted unfinished turns; `completedTerminalKey` identifies the one terminal already observed before acknowledgement; `deferredCompletions` retains terminal state while acknowledgement is unsettled. If execution stops after any of these writes, a later terminal or acknowledgement can still complete only the owned turn; no global all-terminal release remains.

## Packaged build-57 verification — 2026-11-27 13:31 +03:00

Functional run: the combined build-57 two-steer path reached idle with no Working indicator or stop button, preserved both different assistant responses and completed history replay without an empty frame. The subsequent first-`stream_complete` boundary send also delivered exactly once and settled. Run report: `testcases/reports/2026-11-27_phase3_message_visibility.md`; traces: `.tmp/k5-vscode/phase3-build57-distinct-two-steers.json`, `phase3-build57-two-steers-replay-verified.json`, `phase3-build57-running-idle-boundary.json` and `phase3-build57-boundary-replay.json`.

REAL WORLD: accumulated — the owner's main VS Code profile and sessions; data and machine — his Windows machine; path — Second Side Bar steering. Build 57 is installed on main without an Extension Host restart. Isolated acceptance passes; the accumulated-main path is not verified, so this bug remains open and is not DONE.

## Decisions made without the owner

Classified as S2 because the visible stop/working state misrepresents completed work and blocks the normal composer lifecycle. Registered separately from bug 44: that bug covers premature completion attention, while this defect suppresses terminal idle through a different acknowledgement ordering. Kept the same-turn re-arm behavior as an explicit control instead of deleting all late registration.

## Links

- `bugs/44_steer_turn_complete_attention.md`
- `bugs/11_steer_delivery_and_immediate_display.md`
- `plans/07_epic04_phase3_message_visibility_steering.md`
- `apps/vscode/src/runtime/session-runtime.ts`
- `apps/vscode/test/session-runtime.test.ts`

[TESTED: 2026-11-27 · real packaged build-55 DOM/provider/durable reproduction and red-before public runtime regression; fix verification pending]
