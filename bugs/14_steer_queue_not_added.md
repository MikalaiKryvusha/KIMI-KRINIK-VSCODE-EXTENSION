# Bug 14 — A follow-up is not added to the visible queue

**Status:** 🔧 immediate text+image queue, dequeue delivery and replay verified on isolated build 19; video and main-profile acceptance pending
**Version/build:** KIMI KRINIK 1.0.0 · `8ac5df733` · installed VSIX on the owner's accumulated VS Code profile · **When/context:** 2026-11-24 13:09 +03:00, owner live steering acceptance
**Severity:** S2
**Fixing:** next work session inside KIMI KRINIK; run and verify fixes in an isolated VS Code environment
**Fix accepted when (observable):** with AUTO STEER OFF during a running turn, Send immediately adds the exact text and attachments to the visible queue; after the active turn the queued content is sent once, removed once and shown in history with its attachments.

## Symptom

During the same live steering review the owner reported: «да и очередь не добавляется». The precise switch state and attachment combination must be captured by reproduction rather than inferred.

## Repro

1. Start a running turn with AUTO STEER OFF.
2. Send a text follow-up and inspect the visible queue immediately.
3. Repeat with text plus an attachment and with an attachment only.
4. Allow the active turn to finish and inspect the outgoing request, queue and history.

## Expected result

`GOAL.md` requires Steer OFF to use the ordinary queue. Queue insertion and its visible row must be immediate; dequeue must preserve the complete content exactly once.

## Actual result

The owner reports that the queue is not added. No isolated reproduction has yet established whether insertion, rendering or a state race is responsible.

## Forensics / hypotheses

- `apps/vscode/webview-ui/src/stores/chat.store.ts:257-269` enqueues only while the store still reports `isStreaming`.
- `QueuedMessagesPanel` returns nothing for an empty queue and shows only text plus a media label, not thumbnails.
- The existing AUTO STEER OFF store test checks queue state, not the immediately rendered panel or the real completion transition.
- 2026-11-24 14:12 +03:00, isolated current VSIX: a long first request started, a second text follow-up immediately showed `1 в очереди`, and the queue row was visible with the VS Code-derived background. An earlier agent statement that the queue was missing was premature and is corrected: the first request was still initializing. This text-only run does not reproduce the owner's failure; the exact switch state, attachment combination and completion race remain open.
- 2026-11-24 19:07 +03:00, build 3, owner's accumulated profile, AUTO STEER OFF: three text follow-ups were visibly queued and the owner prepared a fourth. Text-only queue insertion and rendering therefore pass in this live run; dequeue, media and lightning behavior remain separate open cases.

## Fix plan

Reproduce text and media cases in the isolated installed VSIX, printing the stand state before attributing a red result. Trace store insertion, panel rendering and the running→idle dequeue. Add immediate visual and exactly-once delivery regressions without changing the ON path.

## Isolated text+image evidence — 2026-11-25 04:08 +03:00

With AUTO STEER OFF and a held running turn, pasting PNG and sending `steer media` immediately produced one visible queue row with the exact text and «+ медиа». After release, the raw provider request contained one text part and exactly one PNG data URL. Replay restored the media entry and clickable thumbnail with the same URI. Report: `testcases/reports/2026-11-25_media_queue_steer.md`.

Video-only, additional race combinations and the owner's accumulated main profile remain open; no DONE claim.

## Decisions made without the owner

Kept queue behavior separate from AUTO STEER ON delivery because the required state and user-visible evidence differ. No product code was changed in this report.

## Links

- `testcases/TC_K5_live_acceptance.md` C10 and C19
- `bugs/11_steer_delivery_and_immediate_display.md`
- `bugs/13_steer_attachments_and_thumbnails.md`
