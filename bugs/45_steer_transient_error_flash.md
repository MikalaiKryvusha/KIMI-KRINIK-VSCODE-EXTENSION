# Bug 45 — a red error flashes in the chat while a steering message is being sent

**Status:** 🔴 OPEN
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

## Forensics / hypotheses

- Trace `chat.handler`/`SessionRuntime.steer` result transitions, `sendIdle` fallback, optimistic records and `inlineError` rendering.
- `bugs/44` is separate: completion sound and visible red error may share a lifecycle trigger, but no common cause is assumed.

## Fix plan

Capture the red frame's text and owning message first, then test the exact accepted/failed steering boundary through the public event/store path. Suppress only the incorrect transient state; do not hide genuine errors.

## Decisions made without the owner

Filed as a separate visible-error defect rather than merged into completion attention or message loss. No implementation decision yet.

## Links

- `bugs/44_steer_turn_complete_attention.md`
- `bugs/11_steer_delivery_and_immediate_display.md`
- `bugs/18_reentrant_prompt_internal_error.md`
- `bugs/29_DONE_preflight_error_deletes_unrelated_history.md`
