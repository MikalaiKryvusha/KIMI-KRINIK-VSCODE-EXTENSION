# Bug 35 — Sent attachment remains in the composer while its text bubble appears without it

**Status:** 🔴 OPEN
**Version/build:** KIMI KRINIK 1.0.0, build 33 installed on the owner's profile; the running build has not yet been measured · **When/context:** 2026-11-26 01:01 +03:00, tossed by the owner during Session-header UI work
**Severity:** S2
**Fixing:** after the current Session-header and Compact-copy refinement, before lower-priority backlog work
**Fix accepted when (observable):** one Send action shows the message text and attachment thumbnail together, removes the attachment from the composer in the same observable update, and delivers the attachment exactly once; the same behavior remains after the response and session reload.

## Symptom

The owner sent a message with an image. The text bubble appeared in the chat while the image remained attached to the composer. Only several seconds later did the image appear in the chat message. This intermediate state makes the send look inconsistent.

Owner's original report: «я отправил сообщениее с картинкой, но какое-то время картинка ещё оставалась прекреплённой к пол ввода, хотя текстовый пузярь моегно сообщенгия уже появился в полотне чата. И только через несколько секунд к нему добавилась картинка из поля ввода. Странный рассинхрон»

## Repro

Not yet reproduced by the agent. Start from the owner's user path on the accumulated main profile:

1. Open a conversation and attach an image to the composer.
2. Enter text and send once.
3. Observe the composer and new chat bubble frame by frame from the send action until the response completes.
4. Record when the text, thumbnail and composer attachment appear or clear, then reload and inspect the persisted message.

## Forensics

The owner's report above is the current primary evidence. No frame sequence, event trace or model-request capture has been collected for this specific race yet.

## Root cause / Hypotheses

Unassigned. Do not infer whether this is optimistic media rendering, deferred composer cleanup, host acknowledgement or replay reconciliation before reading the live sequence.

## Fix plan

Reproduce through the installed VSIX with frame and event observation at Send. Trace the existing media state from the composer through `chat.store.sendMessage`, optimistic message creation, acknowledgement and replay. Make one targeted change at the owning state boundary, add a regression that observes text/media/composer together, and verify the real accumulated-profile path without weakening the delivery coverage in bug 13.

## Decisions made without the owner

Classified as S2 because the product presents contradictory send state for several seconds; no data loss has been observed. Kept this separate from bug 13 because the earlier report concerns steering delivery and thumbnails, while this symptom concerns timing between the composer and an already visible message.

## Links

- `bugs/13_steer_attachments_and_thumbnails.md`
- `bugs/12_steer_composer_restores_previous_text.md`
- `bugs/25_first_prompt_assistant_message_flicker.md`
- `testcases/reports/2026-11-25_media_queue_steer.md`
