# Bug 13 — Steering attachments are not delivered and steer bubbles lack clickable thumbnails

**Status:** 🔧 ON/OFF image+video and media-only delivery, thumbnails/viewer and replay verified on isolated build 19; main-profile acceptance pending
**GitHub issue:** https://github.com/MikalaiKryvusha/KIMI-KRINIK-VSCODE-EXTENSION/issues/27
**Version/build:** originally `8ac5df733`; media presentation reproduced by the owner on KIMI KRINIK 1.0.0 build 3 · installed VSIX on the owner's accumulated VS Code profile · **When/context:** 2026-11-24 13:09 +03:00 and again at 2026-11-24 19:07 +03:00, owner live steering acceptance
**Severity:** S2
**Fixing:** this session inside KIMI KRINIK; reproduce at the existing component/runtime boundaries and verify fixes in an isolated VS Code environment
**Fix accepted when (observable):** a steering message with an image or video appears immediately with its thumbnail, opens that attachment in the viewer on click, is delivered to the engine exactly once, and retains the same thumbnail/viewer behavior after completion and reload.

## Symptom

The owner reports that a steering message with an attachment is not sent. The owner also requires attachments in chat bubbles to render thumbnails that open in the media viewer.

## Repro

1. Start a long-running turn with AUTO STEER ON.
2. Attach an image, send text with it, and immediately inspect the new bubble.
3. Click the thumbnail and inspect the viewer.
4. Read the actual model request and reload the session to check persisted rendering.

## Expected result

Immediate visible text and media, clickable thumbnail preview, exactly one delivered attachment, and equivalent rendering after replay.

## Actual result

The owner observed that the steering message with an attachment was not sent. Steer bubbles currently have no media thumbnail/viewer path.

2026-11-24 19:07 +03:00, build 3: the owner again reported that media attached to a Steer message is not displayed. The presentation defect is confirmed on the current real path; delivery of that attachment remains unverified in this run.

## Forensics / hypotheses

- `apps/vscode/webview-ui/src/stores/chat.store.ts:284-301` builds `ContentPart[]`, marks media as steering and removes it only after acknowledgement; mocked store tests assert this path but the real delivery failure is not reproduced.
- `apps/vscode/webview-ui/src/components/ChatMessage.tsx:31-39` renders `SteerBubble` as text only.
- `UserMessage` already combines `MessageMedia` with `MediaPreviewModal` at `ChatMessage.tsx:206-223`; the steering renderer does not reuse that path.
- Whether non-delivery and missing thumbnails have one cause is not established.

## Fix plan

First reproduce the real attachment request in an isolated VS Code environment. Fix delivery at the owning runtime/store boundary and reuse the existing media thumbnail/viewer components for optimistic and replayed steer items. Cover text+image, media-only, video, rejected send and reload without weakening existing delivery assertions.

## Decisions made without the owner

Recorded delivery and presentation in one media-focused bug while keeping their hypotheses separate. No product code was changed in this report.

## Links

- `testcases/TC_K5_live_acceptance.md` C19
- `bugs/11_steer_delivery_and_immediate_display.md`
- `bugs/14_steer_queue_not_added.md`

## Fix evidence — 2026-11-24 22:02 +03:00

`SteerBubble` now reuses `MessageMedia` and `MediaPreviewModal`; media-only content no longer creates an empty text paragraph. Queue lightning carries the queue ID through the same optimistic path.

Hygiene: the original renderer was red because no `img[alt="Media"]` existed; after the change image/video thumbnails and same-URI viewer checks pass. Existing runtime conversion tests remain green.
Functional run: a real packaged image paste produced a visible thumbnail in the installed UI and opened the same data URI in the viewer. The media-capable model fallback means fake-model delivery of that media was not proven. Final main-profile build-12 acceptance remains pending.

## Media delivery evidence — 2026-11-25 04:08 +03:00

Supersedes the earlier unproven-delivery caveat for PNG on isolated build 19. The isolated testkit model enabled image/video input; AUTO STEER ON running-turn steering produced one text part and exactly one PNG data URL in the raw provider request. AUTO STEER OFF immediately showed queue text plus «+ медиа» and dequeue produced the same single-image request. Replay restored two media entries with two thumbnails and one shared source; viewer source matched exactly. WebP `.tmp/k5-vscode/57-k13-media-replay.webp` was opened and read. Report: `testcases/reports/2026-11-25_media_queue_steer.md`.

Video-only delivery and the owner's accumulated main profile remain unverified; this bug is not DONE.

## Media-only and video evidence — 2026-11-25 04:18 +03:00

ON image-only carried one PNG and zero text characters. OFF video-only carried one generated valid MP4 and zero text characters. Both provider shapes were `valid: true`. Video thumbnail and replayed video preview shared the same data URI. WebP `.tmp/k5-vscode/58-k14-video-replay.webp` was opened and read. Report: `testcases/reports/2026-11-25_media_only_video.md`.

The full isolated media matrix now passes; only accumulated main-profile acceptance remains.
