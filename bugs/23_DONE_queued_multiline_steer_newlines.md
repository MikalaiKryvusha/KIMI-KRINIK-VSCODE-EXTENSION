# Bug 23 — Verify multiline payload integrity through queue and Steer

**Status:** ✅ DONE — exact payload verified on isolated build 19 in AUTO STEER OFF queue/dequeue and ON running-turn Steer
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

The single-line appearance is only the intentional queue preview. On isolated build 19, both OFF queue/dequeue and ON running-turn Steer delivered the exact four-line sample including its blank line; provider payloads matched byte-for-byte and final bubbles retained the lines.

## Forensics

- `bugs/01_DONE_multiline_user_messages.md:39` explicitly records that the queued-message panel is an intentionally line-clamped preview.
- The same closed bug documents exact idle/steer payload regressions and a real provider observation of the original newline.
- Recent lifecycle changes in `bugs/22` make a fresh current-build queue/dequeue check necessary; no cause is inferred from the preview.

## Root cause / Hypotheses

1. Confirmed: only the intentional preview is flattened; the payload remains intact.
2. Refuted on build 19: OFF queue/dequeue preserved the exact sample.
3. Refuted on build 19: ON running-turn Steer preserved the exact sample.

## Resolution

Both deterministic modes passed on the current isolated VSIX; no product change was needed and the line-clamped preview remains unchanged.

## ✅ STATUS: DONE (2026-11-25 02:58 +03:00)

Hygiene: existing multiline store regressions remain green in the full extension suite (597 passed, 1 skipped, 0 failed); root lint exits 0. No source or test assertion was changed for this resolution.
Functional run: fresh isolated build 19, exact owner sample. AUTO STEER OFF queue/dequeue produced `exact: true` in request 1; AUTO STEER ON running-turn Steer produced `exact: true` in request 2. Both actual strings equaled the UTF-8 sample including `\n\n`. Final user bubbles were read in the UI; WebP `.tmp/k5-vscode/52-k23-multiline-steer-exact.webp` was opened and read. Report: `testcases/reports/2026-11-25_multiline_queue_steer.md`.

## Decisions made without the owner

Classified the screenshot as research rather than claiming a confirmed payload defect. Kept the existing line-clamped preview unchanged and returned to the in-flight trilingual-label task.

## Links

- `bugs/01_DONE_multiline_user_messages.md`
- `bugs/11_steer_delivery_and_immediate_display.md`
- `bugs/14_steer_queue_not_added.md`
- `bugs/22_first_send_stuck_in_steering_queue.md`
