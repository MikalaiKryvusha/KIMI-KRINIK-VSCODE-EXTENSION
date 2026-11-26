# Bug 46 — the beginning of packaged attention audio is clipped (“Это” is not heard)

**Status:** 🔬 MEASUREMENT COMPLETE — clipping not reproduced on packaged previews; no code change justified; accumulated main-profile/audible path remains open
**Version/build:** KIMI KRINIK 1.0.0, owner's accumulated profile · **When/context:** 2026-11-26, owner heard “Это Кими Криник — задача завершена” without the initial word «Это»
**Severity:** S2
**GitHub issue:** https://github.com/MikalaiKryvusha/KIMI-KRINIK-VSCODE-EXTENSION/issues/32
**Fixing:** focused coding session after this research

**Goal vector:** **Maintain + Avoid.** Every packaged notification must be audible from its first recorded word through its end, without requiring the user to infer missing speech. Any added leading pause must be justified by the actual playback chain rather than masking an initialization race.

**Fix accepted when (observable):** the same packaged MP3 plays from its first recorded sample/word on the real VS Code webview path, including the first notification after activation and subsequent notifications. Measure the audio start and read the played request path; verify EN/RU/ZH recordings and both voice and non-voice sounds where applicable.

## Symptom

[OWNER] «при воспроизведении аудио, типа "Это кими Криник - задача завершена" - не слошно слова "это"» · 2026-11-26 (chat).

The initial word «Это» is not heard in the packaged attention recording.

## Attempt log

- No implementation attempt yet.
- Owner's hypothesis: add approximately one second of leading silence to every sound because the beginning may be lost during VS Code playback initialization.
- Owner requested web research before changing the recordings.

## Expected result

The entire packaged recording is heard from the first word. Any leading pause is intentional, consistent and does not delay attention unnecessarily.

## Actual result

The first word is intermittently or systematically lost. Whether the source MP3 already contains leading silence, whether playback starts after an offset, and whether an audio context resumes late are unverified.

## Repro

1. Inspect the packaged MP3's initial samples and metadata without assuming it is silent.
2. Trace the call that selects and starts the recording through the VS Code webview.
3. Measure the first audible frame relative to the play call, source load, audio-context resume and notification event.
4. Compare first-play and warmed-up playback, and the real extension path with a browser control.

## Forensics / hypotheses

- Possible audio-context or media-element startup delay, autoplay-policy suspension, source reload, or early playback stop.
- Possible source-file leading silence or encoder delay; not established.
- `lib/attention.ts` and `lib/sounds.ts` are the webview playback boundary to inspect; the recording itself and its packaging are separate suspects.

## Knowledge base — raw search data

- [MDN — `HTMLMediaElement.play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play): “A `Promise` which is resolved when playback has been started, or is rejected if for any reason playback cannot be started.” `NotAllowedError` is the autoplay/permission failure. The method can also delay before its promise resolves.
- [MDN — Autoplay guide](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay): “`play()` returns a `Promise` which is resolved once the media successfully begins to play, and is rejected when playback fails to begin (such as if autoplay is denied).” Programmatic playback in a tab without user interaction is generally blocked. Therefore a pure permission defect would normally reject the whole play, not selectively remove its first word.
- [VS Code — Webview API, supported media](https://code.visualstudio.com/api/extension-guides/webview): “Webviews support audio and video … The following audio formats can be used in Webviews: Wav · Mp3 · Ogg · Flac.” The MP3 route itself is supported.
- [MDN — `AudioContext.resume()`](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/resume): “resumes the progression of time in an audio context that has previously been suspended” and returns a promise resolving when the context resumed. This applies to synthesized tones, whereas recorded notifications use `new Audio`.
- Source playback chain: `lib/attention.ts` → `playRecordedAttention(event, language, volume)` → `playPackagedAudio(path, volume)` → `new Audio(baseUri/path)` → `audio.play()`. There is no `currentTime` assignment, explicit `stop()`, `pause()`, `preload` or wait for readiness. Every notification constructs a new media element.
- `ffprobe` for `resources/attention/ru/turnComplete.mp3`: MP3, 48,000 Hz, mono, duration 2.422500 s. `ffmpeg silencedetect=noise=-45dB:d=0.05` reports the first silence at 0.846062 s, not at 0. The stream starts at 0.023021 s. The initial word is therefore present in the source rather than hidden behind a second of leading silence.
- Controls: English `turnComplete.mp3` has 0.231 s of leading silence at the same threshold; `resources/glass.mp3` has no leading silence before its first reported silence at 0.623083 s. A uniform one-second padding rule would change all three files differently and is not justified by a common source defect.
- The Stack Overflow page about Safari skipping initial seconds returned HTTP 403, so no claim from that page is used. VS Code/Electron behavior must be measured on the product path rather than inferred from Safari.

## Root cause / Hypotheses

1. **Leading hypothesis — first-play initialization/readiness race.** The source starts with speech, and the implementation starts playback immediately on a fresh element without waiting for `canplay`/`canplaythrough`. An initial output/media pipeline delay can lose a short first utterance. This is plausible but not yet observed on the real webview and is not the same as autoplay rejection.
2. **Alternative — notification/reload lifecycle.** A new `Audio` object per event and no shared readiness/queue can overlap or restart playback when events repeat or the webview reloads. The exact event sequence is still needed; no common cause with bugs/44 is assumed.
3. **Rejected as the primary source-file explanation for Russian.** The Russian recording has no leading second of silence. Padding every MP3 would mask some startup paths while adding avoidable delay, and would not fix a rejected `play()` promise.

## Focused next steps

1. On the packaged VS Code path, instrument the selected element's `loadstart`, `loadeddata`, `canplay`, `canplaythrough`, `play`, `playing`, `pause`, `ended`, `error`, `currentTime` and `play()` rejection. Compare the first notification with a warmed-up second notification of the same file.
2. Inspect/capture the actual audible output where the harness allows it; DOM events alone do not prove that the first word reached the speakers. Record the running build and source/installed MP3 hashes first.
3. If initialization is confirmed, test readiness-first playback (`preload = "auto"` and waiting for an appropriate readiness event) against a control with a short playback-side delay before `play()`. Do not add silence to every recording before the comparison. Any final delay must have a measured bound and must not turn a permission failure into an assumed success.
4. Add regressions at `lib/sounds.ts` for readiness/rejection and multiple notifications, then observe EN/RU/ZH on the packaged path. Keep the source audio unchanged unless its own measurement proves a content defect.

No human decision is required before these measurements; adding a permanent one-second pause is deferred until evidence selects the mechanism.

## Measurement result — 2026-11-27 02:05 +03:00

Real Sound Settings Preview clicks with user activation produced the following native media observations on packaged build 50:

- EN first play: `playing` at `currentTime = 0`, full `ended` at 4.056 s; warmed second play also starts at zero and completes.
- RU play: starts at zero and ends at exactly 2.4225 s, the source duration.
- ZH play: starts `playing` at zero with no rejection.
- Source and installed EN/RU/ZH MP3 hashes match exactly.

These observations do not support the first-play readiness hypothesis on the measured path. A readiness-first rewrite, shared queue or one-second source pause is therefore not justified and no production code or audio was changed.

Audible capture is unresolved: the available DroidCam microphone recorded only silence and the installed FFmpeg reports `Unknown format 'wasapi'`, so no loopback route was found. This measurement limitation is not attributed to the product. The owner's accumulated-profile notification and audible first word remain open.

Hygiene: source/installed asset identity confirmed; no production diff or new build count is claimed for this measurement-only cut.
Functional run: real packaged Preview paths read through native media events; report `testcases/reports/2026-11-27_attention_audio_first_play.md`.

## Decisions made without the owner

Filed separately from bugs/44 completion-event correctness: a correct event can still have clipped audio. No leading pause has been added and no implementation decision made. Kept the issue open rather than DONE because the original audible accumulated-profile symptom was not observed.

## Links

- `bugs/44_steer_turn_complete_attention.md`
- `bugs/10_DONE_sound_volume_race.md`
- `bugs/17_DONE_attention_voice_missing_identity.md`
- `bugs/24_glass_preview_silent.md`
