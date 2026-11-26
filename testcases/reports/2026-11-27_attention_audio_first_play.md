# Test run report — first and warmed attention audio (bug 46)

**Created:** 2026-11-27 02:05 +03:00 · **Run by:** the agent · **Version/build:** KIMI KRINIK 1.0.0 build 50, win32-x64 VSIX

## 1. Work

`bugs/46` / issue #32: determine whether first-play initialization/readiness clips the first recorded word. Basis: `plans/05_epic04_phase1_steering_attention.md` §4.4, `bugs/46` and the official `HTMLMediaElement.play()` contract.

## 2. Contour

Windows 11, VS Code 1.123.0, packaged build 50 on an isolated profile, real Sound Settings Preview clicks with user activation. Native `Audio` and `AudioContext` were instrumented in the guest execution world; running build 50 was read from the Action Menu. Source and installed EN/RU/ZH MP3 hashes were compared and match exactly.

REAL WORLD: accumulated — the owner's main profile has the original audible symptom; data and machine — his Windows machine; path — Sound Settings Preview on the isolated packaged product. No clipping was reproduced there. The owner's accumulated main-profile notification path and actual speaker output were not verified, so DONE is not claimed.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-27 01:54 +03:00 | `node .tmp/k47-open-sound.mjs` and actual Preview click through `.tmp/k5-cdp.mjs` | EN first `playing` at `currentTime=0`, full `ended` at 4.056 s |
| 2 | 2026-11-27 01:54 +03:00 | `node .tmp/k47-wait-audio-end.mjs` and second actual Preview click | EN warmed playback also starts at 0 and completes |
| 3 | 2026-11-27 01:56 +03:00 | select RU, reopen Sound Settings and click Preview | RU starts at 0 and ends at the exact source duration 2.4225 s |
| 3b | 2026-11-27 02:20 +03:00 | actual RU Preview second click and `node .tmp/k47-wait-audio-end.mjs` | RU warmed-second playback also ends at 2.4225 s |
| 4 | 2026-11-27 01:58 +03:00 | select ZH and click Preview | ZH starts `playing` at 0; no rejection |
| 5 | 2026-11-27 02:01 +03:00 | `ffmpeg -f dshow -i "audio=@device_cm_…" -t 10 .tmp/k47-ru-preview.wav` | recording contains only silence; no audible-output verdict is possible from this device |
| 6 | 2026-11-27 02:02 +03:00 | `ffmpeg -hide_banner -h demuxer=wasapi` | installed FFmpeg reports `Unknown format 'wasapi'`; no loopback route found |
| 7 | 2026-11-27 02:03 +03:00 | `sha256sum apps/vscode/resources/attention/{en,ru,zh}/turnComplete.mp3 .tmp/k5-vscode/extensions/.../resources/attention/{en,ru,zh}/turnComplete.mp3` | source and installed hashes match for all three files |

## 4. Checks

Hygiene: source/installed asset identity and existing sound suites were not changed; no production code change was made, so no new build or test count is claimed for this measurement-only cut.

Functional run: EN first and warmed previews start at zero and complete; RU and ZH previews start at zero. Every play call precedes readiness by only tens of milliseconds, but `playing` begins at zero rather than a later offset. This does not support a readiness-clipping mechanism on the measured path.

| Case | Status | Observation |
|---|---|---|
| EN first preview | pass | `playing` at 0, full `ended` at 4.056 s |
| EN warmed preview | pass | starts at 0, full completion |
| RU preview | pass | starts at 0, full `ended` at source duration 2.4225 s |
| ZH preview | pass | starts `playing` at 0, no rejection |
| Source/installed identity | pass | all three hash pairs match |
| Audible first word | blocked | DroidCam records silence; FFmpeg has no WASAPI loopback |
| Accumulated owner notification | not verified | no inference from Preview to the original accumulated-profile event |

## 5. Found

- No readiness defect reproduced. A readiness-first rewrite, shared playback queue or permanent one-second source pause is not justified by these observations.
- The only observed limitation is measurement: the available audio device captured silence and no WASAPI loopback exists. This is not attributed to the product.

## 6. Traces

- `.tmp/k47-audio-setup.mjs`, `.tmp/k47-verify-summary.mjs`, `.tmp/k47-wait-audio-end.mjs` — native guest media instrumentation.
- `.tmp/k47-ru-preview.wav` — silent microphone recording, not used as product evidence.
- `.tmp/k5-vscode/extensions/mikalai-kryvusha.kimi-code-kaif-1.0.0/resources/attention/{en,ru,zh}/turnComplete.mp3` — installed assets with hashes matching source.
- `bugs/46_attention_audio_start_clipped.md`.

## 7. Verdict

partial — first/warmed packaged preview paths do not reproduce clipping and require no code change. The original audible accumulated-profile symptom remains open until an audible observation is possible.
