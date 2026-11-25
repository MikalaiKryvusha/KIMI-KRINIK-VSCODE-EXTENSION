# Bug 24 — Glass preview is silent

**Status:** 🔧 fix pending real-path verification
**Version/build:** owner screenshot on KIMI KRINIK 1.0.0 build 3 · **When/context:** 2026-11-24 19:57 +03:00, owner sound-settings preview
**Severity:** S2
**Fixing:** this session with the prerecorded-notification change; verify through the actual isolated sound-settings button

**Fix accepted when (observable):** clicking Preview on any event configured as Glass constructs and plays the packaged Glass audio at the selected volume in the installed VSIX; a rejected play is logged, and the same mechanism works for localized event recordings.

## Symptom

The owner clicks the preview button for Glass at 45% volume and hears nothing.

## Expected result

A real audible preview of the packaged Glass sound. No dynamic speech route is involved.

## Actual result

The preview is silent on the owner's real profile. The initial unit test only mocked `Audio.play()` and did not observe media decoding or playback.

## Forensics / hypotheses

- `apps/vscode/webview-ui/src/lib/sounds.ts` used `resources/glass.opus` and swallowed `audio.play()` rejection.
- `apps/vscode/src/KimiWebviewProvider.ts` allows packaged media through `media-src`.
- The source Ogg/Opus file is valid: 27,076 bytes, duration 1.656583 seconds.
- Actual decoding/autoplay failure was not observable because rejection was swallowed. The fix uses an MP3 rendition of the same sound and logs playback rejection.

## Fix plan

Use `resources/glass.mp3`, share the packaged-audio helper with localized event recordings, cover the rejected-play log, then click the real isolated Preview button and read the created audio element, play result and console.

## Decisions made without the owner

Chose MP3 for a more direct Chromium-compatible playback path while retaining the original Ogg/Opus asset. No audible acceptance by the owner is claimed yet.

## Links

- `bugs/17_DONE_attention_voice_missing_identity.md`
- `testcases/TC_K5_live_acceptance.md` C16/C22
- `apps/vscode/webview-ui/src/lib/sounds.ts`

## Verification update — 2026-11-24 22:02 +03:00

The real isolated Preview button created `resources/glass.mp3`; `play()` resolved, `readyState` reached 4, currentTime advanced and completed at 1.650083 seconds, and `error` was null. Localized recordings use the same packaged-audio boundary. The owner's specific audible confirmation covered all three voice languages, not a separate Glass listening verdict. Main-profile build-12 restart remains pending, so the file is not tagged DONE.
