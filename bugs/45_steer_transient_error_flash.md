# Bug 45 — a red error flashes in the chat while a steering message is being sent

**Status:** 🔧 ISOLATED ACCEPTANCE PASS on packaged build 50 — accumulated main-profile acceptance pending; not DONE
**Version/build:** KIMI KRINIK 1.0.0, owner's accumulated profile · **When/context:** 2026-11-26, owner report during steering
**Severity:** S2
**GitHub issue:** https://github.com/MikalaiKryvusha/KIMI-KRINIK-VSCODE-EXTENSION/issues/31
**Fixing:** after bugs/44 and the current autonomous-loop verification cut

**Goal vector:** **Avoid.** Sending a steering message must not display a transient red error to the user. Genuine failures must remain visible with their real text and recovery action.

**Fix accepted when (observable):** accepted immediate and queued steering paths show no red error frame at any point; rejected/failed submissions show only the actual persistent error with the correct rollback. A frame-level event/DOM trace and red-before-fix regression identify the faulty transition, and the packaged VS Code path is observed.

## Symptom

[OWNER] «в момент отправки стиринг сообщений на мгновение в полотне чата видна красная ошибка какая-то - баг» · 2026-11-26 (chat).

A red error appears briefly during steering submission and disappears. The owner did not report its text; the exact event and error identity are not yet known.

## Expected result

No error is rendered while a steering message is being accepted or while work continues. Only a genuine terminal or non-terminal failure may appear, using the actual error payload rather than a transient placeholder.

## Actual result

A transient red error is visible momentarily on steering. It is unverified whether this is a runtime error, a failed steer fallback, a superseded preflight error, or a rendering transition.

## Repro

1. Start a running turn with AUTO STEER ON and capture bridge events and DOM mutations.
2. Send steering messages across running→idle boundaries.
3. Record every error payload, optimistic state transition and red-frame insertion/removal in one timeline.
4. Distinguish accepted steer, queued steer and rejected fallback; preserve genuine error rendering as the control case.

## Forensics

The red frame was captured with code `internal`, `terminal:false`, message `Internal error occurred.` and detail `A response is already being generated for this session.` Its visible toast appeared for about four seconds and disappeared while the agent continued.

Bridge timings established the owning sequence: ordinary `streamChat id=71` was still in preflight; `steerChat id=73` saw `runtime.isBusy === false` and returned `{ok:false}`; the store's fallback `streamChat id=74` then collided with the original active prompt and emitted the transient internal error. The original request continued afterward. Evidence: `.tmp/k5-vscode/user/logs/20261127T010618/window1/exthost/output_logging_20261127T010619/1-KIMI KRINIK.log:74-81,131`.

`bugs/44` is separate: completion attention and the visible red error have different owning transitions, although both were observed during steering.

## Fix

Track the ordinary prompt preflight per webview in `chat.handler`. `steerChat` waits for that preflight to reach `runtime.prompt` before deciding whether the session is busy. A genuinely idle session still returns `{ok:false}` and a genuine preflight failure releases the waiter instead of hanging it. No error event or renderer is suppressed.

Regression evidence: the real BridgeHandler case was red before the fix (`{ok:false}` during preflight) and is green afterward; the genuinely idle control also passes. Full bridge-handler suite 39/39, full extension 666/1, typecheck and root lint green. Build 50 is packaged and audited.

Functional run: immediate and accepted-queued `/compact` build-50 paths produce no error event or red DOM frame. Empty-history `/compact` still shows persistent `compaction.unable` with the real detail and Retry; Glass plays. WebP 204/205 inspected. Report: `testcases/reports/2026-11-27_steer_transient_error_build50.md`.

REAL WORLD: accumulated — owner's main VS Code profile and steering history; data and machine — his Windows machine; path — Second Side Bar immediate/queued steering. Verified on the isolated packaged product with controlled model state; not verified on the accumulated main profile, so DONE is not claimed.

TWINS: searched `!runtime.isBusy`, `runTurnAction(` and the preflight/fallback path. `steerChat` is the only early `{ok:false}` fallback of this form; ordinary prompts and host slash actions share the same readiness handoff. No second early fallback required a product change.

TWINS-MECH: a submission can be rejected before the original turn has established busy state, then resent into that turn. The guard covers the actual BridgeHandler entry, while the store and genuine runtime error paths remain control cases.

AFTER-WORK: each view's preflight promise resolves on readiness and in `finally` on every early return/error. A later `steerChat` cannot wait forever after a failed preflight, and map cleanup happens only if the entry still belongs to the same preflight.

## Decisions made without the owner

Filed as a separate visible-error defect rather than merged into completion attention or message loss. Chose per-view preflight tracking at the actual BridgeHandler boundary rather than suppressing the toast, changing the store fallback or delaying by a timer. Kept the bug open rather than DONE until accumulated main-profile acceptance.

## Links

- `bugs/44_steer_turn_complete_attention.md`
- `bugs/11_steer_delivery_and_immediate_display.md`
- `bugs/18_reentrant_prompt_internal_error.md`
- `bugs/29_DONE_preflight_error_deletes_unrelated_history.md`
