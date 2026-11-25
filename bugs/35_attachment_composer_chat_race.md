# Bug 35 — Sent attachment remains in the composer while its text bubble appears without it

**Status:** 🔧 fixed and verified through isolated build 37, including completion and replay; accumulated main-profile acceptance pending
**Version/build:** reported with build 33 installed; fixed in KIMI KRINIK 1.0.0 build 37 · **When/context:** 2026-11-26 01:01 +03:00, tossed by the owner during Session-header UI work
**Severity:** S2
**Fixing:** implemented and verified on the isolated real product in this session; main-profile reload remains
**Fix accepted when (observable):** one Send action shows the message text and attachment thumbnail together, removes the attachment from the composer in the same observable update, and delivers the attachment exactly once; the same behavior remains after the response and session reload.

## Symptom

The owner sent a message with an image. The text bubble appeared in the chat while the image remained attached to the composer. Only several seconds later did the image appear in the chat message. This intermediate state makes the send look inconsistent.

Owner's original report: «я отправил сообщениее с картинкой, но какое-то время картинка ещё оставалась прекреплённой к пол ввода, хотя текстовый пузярь моегно сообщенгия уже появился в полотне чата. И только через несколько секунд к нему добавилась картинка из поля ввода. Странный рассинхрон»

## Repro

Reproduced on isolated build 36 and re-run after the fix on build 37 through this user path:

1. Open a conversation and attach an image to the composer.
2. Enter text and send once.
3. Observe the composer and new chat bubble frame by frame from the send action until the response completes.
4. Record when the text, thumbnail and composer attachment appear or clear, then reload and inspect the persisted message.

## Forensics

The owner's report above is the primary symptom evidence.

2026-11-26 02:20 +03:00 — reproduced through a real isolated build 36 with AUTO STEER ON, a held model turn and a real pasted PNG. `MutationObserver` separated the composer and chat:

| Relative time | Composer image | Chat image | Steering text in chat |
|---|---:|---:|---|
| before Send | 1 | 0 | absent |
| 7.0 ms | 1 | 1 | present |
| 39.9 ms | 0 | 1 | present |

The optimistic message already owns the image. The composer retains a steering-marked copy until the asynchronous `bridge.steerChat` acknowledgement. The live gap was short with a one-pixel PNG, but it confirms the ownership/timing mechanism behind the owner's accumulated-profile observation; the several-second duration itself was not reproduced.

Before the fix, `steerNow` marked ready media as `steering: true`, appended the optimistic turn, and removed the sent media only in the later acknowledgement callback. Runtime `SteerInput` carries the original full input, so no media-dropping reconciliation was found on that path.

Probe: `.tmp/k35-media-race.js`; real model request was held before the paste/send sequence.

## Root cause / Hypotheses

Confirmed for the composer side: sent media cleanup waits for the asynchronous steer acknowledgement instead of occurring with the optimistic turn. Failure restoration must be preserved after moving cleanup earlier. No separate cause for delayed image decoding on the owner's large image has been established.

## Fix plan

Reproduce through the installed VSIX with frame and event observation at Send. Trace the existing media state from the composer through `chat.store.sendMessage`, optimistic message creation, acknowledgement and replay. Make one targeted change at the owning state boundary, add a regression that observes text/media/composer together, and verify the real accumulated-profile path without weakening the delivery coverage in bug 13.

## Fix evidence — 2026-11-26 02:28 +03:00

`steerNow` now removes the sent ready media immediately instead of marking it for later acknowledgement cleanup. The obsolete `steering` draft flag is removed. Both genuine blocked/rejected paths restore the captured sent items through `restoreSentDraftMedia`, preserving any unrelated or still-processing draft entries and the existing latest-request guard.

Hygiene: the updated public-store regression was red before the fix because sent media remained; it passes afterward, including the optimistic full-content assertion and the existing failed-send restoration case. Full extension 646 passed / 1 skipped; lint, typecheck, build and VSIX audit are green.

Functional run: the same `.tmp/k35-media-race.js` path on build 37 produced only the initial composer-owned state and then, at 11.8 ms, chat text + image with zero composer media. No intermediate sent-text/composer-media frame appeared during the two-second window. After completion and history replay, the chat retained one image, the response text remained, and composer media stayed zero. WebP: `.tmp/k5-vscode/104-build37-media-race-fixed.webp`, opened and read. Report: `testcases/reports/2026-11-26_build_37_media_composer_atomicity.md`.

TWINS: searched `steering` draft flags, delayed media filters and the two failure-restoration maps; only `chat.store.ts` owned this mechanism. Both blocked and rejected paths now use the same restoration helper. Existing provider-content and queue coverage remains green.

REAL WORLD: accumulated — the owner's main profile has build 37 installed but has not been reloaded and observed; data and machine — his Windows VS Code and original large image; path — Second Side Bar. The isolated real product, including completion and replay, is verified; the original accumulated several-second timing is not re-observed. This bug is not DONE.

## Decisions made without the owner

Classified as S2 because the product presents contradictory send state for several seconds; no data loss has been observed. Kept this separate from bug 13 because the earlier report concerns steering delivery and thumbnails, while this symptom concerns timing between the composer and an already visible message.

- Removed sent media immediately rather than waiting for acknowledgement; genuine failures restore the captured items explicitly.
- Removed the now-dead `steering` flag rather than leaving a second media-ownership state.
- Kept unrelated processing uploads and the latest-outbound-request restoration guard unchanged.
- Did not infer or claim an image-decoding fix; no separate decoding cause was established.

## Links

- `bugs/13_steer_attachments_and_thumbnails.md`
- `bugs/12_steer_composer_restores_previous_text.md`
- `bugs/25_first_prompt_assistant_message_flicker.md`
- `testcases/reports/2026-11-25_media_queue_steer.md`
