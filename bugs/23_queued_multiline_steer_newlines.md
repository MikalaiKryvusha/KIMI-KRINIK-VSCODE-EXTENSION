# Bug 23 — Verify multiline payload integrity through queue and Steer

**Status:** 🔬 research-only — preview flattening observed; payload loss not established
**Version/build:** owner's accumulated VS Code profile, main process created 2026-11-24 17:57:52 before build 1 · **When/context:** 2026-11-24 18:32 +03:00, owner screenshot tossed in during the trilingual Action Menu task
**Severity:** S2 if the outgoing payload is altered; preview-only appearance is the previously accepted behavior
**Fixing:** after the current trilingual-label VSIX is packaged and installed; reproduce before changing product code
**Fix accepted when (observable):** the exact four-line owner sample, including its blank line, survives queue insertion, dequeue and running-turn Steer delivery; the outgoing request and final user bubble retain every internal `\n` exactly once in both AUTO STEER modes.

## Symptom

The owner suspects that a follow-up lost line breaks when queued and sent as Steer. The screenshot shows the earlier sent bubble with separate lines and the later queue preview as one joined line. It does not show the later queued item's outgoing request or final bubble.

## Repro (deterministic)

1. During a held running turn with AUTO STEER OFF, send `English: Language / Язык / 语言\nРусский: Язык / Language / 语言\n中文： 语言 / Language / Язык\n\nДа, именно так`.
2. Read the queue preview and the stored string, release the turn, then read the exact provider request and final user bubble.
3. Repeat the same sample with AUTO STEER ON and compare the steering bridge payload, provider request and final bubble.

## Expected result

`bugs/01` requires exact multiline idle and steering payloads. Queueing and later delivery must preserve the same string; the visual queue preview may remain intentionally line-clamped unless the owner separately requests a UX change.

## Actual result

Only the single-line queue preview is observed. Whether its underlying text or delivered payload lost newlines is unverified.

## Forensics

- `bugs/01_DONE_multiline_user_messages.md:39` explicitly records that the queued-message panel is an intentionally line-clamped preview.
- The same closed bug documents exact idle/steer payload regressions and a real provider observation of the original newline.
- Recent lifecycle changes in `bugs/22` make a fresh current-build queue/dequeue check necessary; no cause is inferred from the preview.

## Root cause / Hypotheses

1. Supported by current evidence: only the intentional preview is flattened; the payload remains intact.
2. Unproven: the current queue/dequeue lifecycle alters the string before sending.
3. Unproven: the current running-turn Steer path alters the string before sending.

## Fix plan

Run both deterministic modes on the current isolated VSIX and read the provider payload. If the payload is exact, record the not-a-defect result and leave the preview unchanged. If any boundary drops newlines, file the confirmed boundary here, add a red regression at that public boundary, fix it surgically and rerun both modes.

## Decisions made without the owner

Classified the screenshot as research rather than claiming a confirmed payload defect. Kept the existing line-clamped preview unchanged and returned to the in-flight trilingual-label task.

## Links

- `bugs/01_DONE_multiline_user_messages.md`
- `bugs/11_steer_delivery_and_immediate_display.md`
- `bugs/14_steer_queue_not_added.md`
- `bugs/22_first_send_stuck_in_steering_queue.md`
